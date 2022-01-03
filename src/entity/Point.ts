import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Point {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    validator: string;

    @Column("int")
    point: number;

    @Column("int")
    era: number;

    @Column("int")
    ratio: number;

    @Column("int")
    timestamp: number;
}
