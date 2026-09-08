const prisma = require("../configs/postgres")

const createAnnouncement = async (req, res) => {
    try{

        const userId = req.user.id;

        const { title, body, departmentId } = req.body;

        if(!title || !body) {
            return res.status(404).json({
                message: 'must input this field'
            })
        }

        const department = await prisma.department.findUnique({
            where: {
                id: departmentId
            }
        });

        if(!department){
            return res.status(404).json({
                message: 'department not exist'
            })
        }

        // create() needs a `data` wrapper, and departmentId must be the
        // id string — department is the whole row, not the id
        const announce = await prisma.annoucement.create({
            data: {
                title,
                body,
                authorId: userId,
                departmentId: department.id
            }
        })

        res.status(201).json({
            message: 'Annouce Posted',
            data: {
                title: announce.title,
                body: announce.body,
                author: announce.authorId
            }
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const getAnnoucement = async (req, res) => {
    try{

        const annouces = await prisma.annoucement.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.status(200).json({
            message: 'list annoucement',
            data: annouces
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const deleteAnnouce = async (req, res) => {
    try{

        const id = req.params.id;

        const exist = await prisma.annoucement.findUnique({
            where: { id: id }
        });

        if(!exist){
            return res.status(404).json({
                message: 'not annoucement found'
            })
        }

        const annouce = await prisma.annoucement.delete({
            where: {
                id: id
            }
        });

        res.status(200).json({
            message: 'annoucement deleted'
        })
    }catch(err){

        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = { createAnnouncement, getAnnoucement, deleteAnnouce }