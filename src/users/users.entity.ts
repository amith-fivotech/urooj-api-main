import { BaseEntity, Entity, Column, Unique, ObjectIdColumn, ObjectID } from "typeorm";
import { DefaultStatusEnum } from "src/common/enum/default.status.enum";
import * as bcrypt from "bcryptjs";
import { Roles } from "src/common/enum/roles.enum";

@Entity()
@Unique(['email'])
export class Users extends BaseEntity {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column()
    otp: number;

    @Column()
    status: DefaultStatusEnum;

    @Column({
        default: '',
        nullable: true
    })
    createdBy: string;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

}