import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { MyContext } from '../../types/MyContext';
@Resolver()
export class LoginResolver {
	@Mutation(() => User, { nullable: true })
	async login(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() ctx: MyContext
	): Promise<User | undefined> {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return undefined;
		}
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			return undefined;
		}
		if (!user.confirmed) {
			return undefined;
		}

		ctx.req.session!.userId = user.id;

		return user;
	}
}
