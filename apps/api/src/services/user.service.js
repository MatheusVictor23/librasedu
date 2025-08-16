import { userRepository, usuarioRepository } from "../repositories/usuario.repository";
import { HttpError } from "../utils/httpError";

export const userService = {
    get: async () => await userRepository.get(),

    getById: async (id) => {
        const user = await userRepository.getById(id);
        
        if(!user) throw new HttpError(404, "Usuário não encontrado!");

        return user;
    },
    create: async(data) => {
        let exists = await userRepository.getByEmail(data.email);

        if(exists) throw new HttpError(409, "Esse email já está em uso!");

        exists = await userRepository.getByCpf(data.cpf);

        if(exists) throw new HttpError(409, "Esse CPF já está em uso!");

        return userRepository.create(data);
    
    },
    update: async(id, data) => {
        const exists = userRepository.getById(id);

        if(!user) throw new HttpError(404, "Usuário não encontrado!");

        return await userRepository.update(id, data)
    },
    delete: async (id) => {
        const exists = userRepository.getById(id);

        if(!user) throw new HttpError(404, "Usuário não encontrado!");

        return await userRepository.delete(id)
}}