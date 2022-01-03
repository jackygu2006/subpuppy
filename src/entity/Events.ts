import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Events {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    event_index: string;

    @Column()
    block_num: number;

    @Column()
    extrinsic_idx: number;

    @Column({length: 255})
    type: string;

    @Column({length: 255})
    module_id: string;

    @Column({length: 255})
    event_id: string;

    @Column("text")
    params: string;

    @Column({length: 255})
    extrinsic_hash: string;

    @Column()
    event_idx: number;
}
