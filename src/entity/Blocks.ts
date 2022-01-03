import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Blocks {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    block_num: number;

    @Column("int")
    block_timestamp: number;

    @Column({length: 100})
    hash: string;

    @Column({length: 100})
    parent_hash: string;

    @Column({length: 100})
    state_root: string;

    @Column({length: 100})
    extrinsics_root: string;

    @Column("text")
    logs: string;

    @Column("text")
    extrinsics: string;

    @Column("int")
    extrinsics_count: number;

    @Column("text")
    event: string;

    @Column("int")
    event_count: number;

    @Column("int")
    spec_version: number;

    @Column({length: 255})
    validator: string;

    @Column("int")
    codec_error: number;

    @Column("int")
    finalized: number;
}
