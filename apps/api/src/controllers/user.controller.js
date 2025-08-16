import { userRepository } from "../repositories/usuario.repository";
import { userService } from "../services/user.service.js";

export const userController  = {
    get: async (req, res, next) => {
        try{
            const data = await userService.get();
            res.json(data);
        }catch(error){
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try{
            const data = await userService.getById(req.params.id);
            res.json(data);
        }catch(error){
            next(error)
        }
    },

    create: async (req, res, next) => {
        try{
            const data = await userService.create(req.body);
            res.status(201).json(data);
        }catch(error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try{
            const data = await userRepository(req.params.id, req.body);
            res.json(data);
        }catch(error){
            next(error)
        }
    },

    delete: async (req, res, next) => {
        try {
            const data = await userRepository.delete(req.params.id);
            res.status(201);
        }catch(error){
            next(error);
        }
    }
}