import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Extrinsics {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    extrinsic_index: string;

    @Column()
    block_num: number;

    @Column()
    block_timestamp: number;

    @Column({length: 255})
    extrinsic_length: string;

    @Column({length: 255})
    version_info: string;

    @Column({length: 255})
    call_code: String;

    @Column({length: 100})
    call_module_function: string;

    @Column({length: 100})
    call_module: string;

    @Column("text")
    params: string;

    @Column({length: 255})
    account_id: string;

    @Column({length: 255})
    signature: string;

    @Column()
    nonce: number;

    @Column({length: 255})
    era: string;

    @Column({length: 255})
    extrinsic_hash: string;

    @Column()
    is_signed: number;

    @Column()
    success: number;

    @Column()
    fee: number;
}
