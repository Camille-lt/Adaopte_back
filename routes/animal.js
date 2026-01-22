const express = require ('express');
const {PrismaClient} = require ('../generated/prisma');
// const {PrismaClient} = require ('@prisma/client'); je ne comprends pas !!


const router = express.Router();
const prisma = new PrismaClient();



// ✅ Version simplifiée qui lit directement la colonne city_name
router.get('/', async (req, res) => {
  try {
    // On récupère simplement tous les animaux. 
    // Prisma inclura automatiquement 'city_name' s'il est dans ton schéma.
    const animals = await prisma.animal.findMany();

    // On renvoie les données directement sans re-formatage complexe
    res.json(animals);
  } catch (error) {
    console.error("Erreur bdd animal :", error);
    res.status(500).json({ message: "Erreur serveur BDD animaux." });
  }
});


router.post('/', async(req, res)=>{

    const {name, date_birth, breed, type,   description, sexe, animal_shelter_id, img_url} = req.body;
    try{
        const newAnimal = await prisma.animal.create({
            data:{
                name,
                date_birth,
                breed,
                type,
                description,
                sexe,
                animal_shelter_id,
                img_url,
            },
        });
        res.status(201).json(newAnimal);
    } catch(error){
        console.error("Erreur :", error);
        res.status(500).json({error})        
    }
});



//route PUT (pour changer une donnée)
router.put('/:id', async(req, res)=>{ // faudra revoir l'info /:id
   const id = parseInt(req.params.id);
   const data = req.body;
    try{
        const updatedanimal = await prisma.animal.update({
            where:{ animal_id: id},
            data: data,
        });
        res.json(updatedanimal);
    } catch(error){
        console.error("Erreur :", error);
        res.status(500).json({error: "WTH ERROR !!!!!"})        
    }
});


 //route delete (pour supprimer une donnée)

router.delete('/:id' , async (req, res) => {

    const id = parseInt(req.params.id);

    try{
        const animal = await prisma.animal.findUnique({
            where: {animal_id: id}
        });

        if(!animal){
             return res.status(404).json({ message: "animal non trouvé." });
        }
        const deletedanimal = await prisma.animal.delete({

            where:{ animal_id: id},
        
        });

        res.json(deletedanimal);
} catch (error){
    console.error("Erreur lors de la suppression : " );
    res.status(500).json({ error: "Erreur BDD animal"})
    
}
});



module.exports = router;