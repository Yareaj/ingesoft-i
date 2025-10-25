// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn() // Define clave primaria auto incremental
    id!: number;      // !: indica que le atributo no puede ser null
    // Definicion de atributos
    @Column({ unique: true })  // Evita duplicados en la base de datos      
    username!: string;
    
    @Column({ unique: true })  
    email!: string;

    @Column({ select: false })   // Oculta atributo. Medida de seguridad
    password_hash!: string;       // dada la naturaleza del atributo
}