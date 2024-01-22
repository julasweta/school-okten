import {
	Body,
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { InjectRedisClient, RedisClient } from "@webeleon/nestjs-redis";
import { ITokenPayload } from "../../common/interfaces/ITOkenPayload";
import { VerificationService } from "../verification/verification.service";
import { UsersService } from "../users/users.service";
import { LoginRequestDto } from "./dto/login.req.dto";
import { UserBaseDto, UserBaseType } from "../users/dto/user.base.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../users/schema/user.schema";
import { CreateUserReqDto } from "../users/dto/req/create-user-req-dto";
import { CreateUserResType } from "../users/dto/res/create-user-res-dto.";
import * as bcrypt from "bcrypt";
import {
	ActivateUser,
	RecoveryPassword,
} from "../../common/interfaces/IListRes";
import { ITokens } from "./interfaces/tokens.type";

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		@InjectModel(User.name) private userModel: Model<User>,
		private readonly verificationService: VerificationService,
		@InjectRedisClient() private redisClient: RedisClient,
	) {}

	async createUser(@Body() body: CreateUserReqDto): Promise<CreateUserResType> {
		console.log("auth serv create user", body);
		const token = await this.verificationService.createToken(
			{
				email: body.email,
				type: "access",
			},
			"30m",
		);
		return this.userService.createUser({ ...body, token });
	}

	async activateUser(
		accessToken: string,
		pass: ActivateUser,
	): Promise<UserBaseType> {
		//console.log(' auth-servic accesstoken', accessToken);
		//console.log(' auth-servic pass', pass);
		const extractUserEmail =
			await this.verificationService.decodeToken(accessToken);
		if (!pass) {
			throw new Error("Password is wrong");
		}
		const password = await bcrypt.hash(pass.password.toLowerCase().trim(), 5);
		//console.log(' auth-servic decode email', extractUserEmail);
		const updatedUser = await this.userModel.findOneAndUpdate(
			{ email: extractUserEmail.email },
			{ $set: { status: "activate", password: password, token: null } },
			{ new: true }, // Опція new повертає оновлений документ
		);
		return updatedUser;
	}

	async recoveryPassword(email: RecoveryPassword): Promise<string> {
		const user = await this.userService.userFindOneEmail(email.email);
		if (!user) {
			throw new Error("User is not Found");
		}
		const token = await this.verificationService.createToken(
			{
				email: user.email,
				type: "access",
			},
			"30m",
		);
		const updatedUser = await this.userModel.findOneAndUpdate(
			{ email: user.email },
			{ $set: { token: token, status: "inactive" } },
			{ new: true }, // Опція new повертає оновлений документ
		);
		return updatedUser.token;
	}

	async login(body: LoginRequestDto): Promise<ITokens> {
		const user = await this.userService.userFindOneEmail(body.email);

		if (!user) {
			throw new UnauthorizedException(
				"This email or password is wrong",
				"This email or password is wrong",
			);
		}
		// console.log('body', body.password);
		//console.log('user', user.password.trim());
		const hashPassw = await bcrypt.compare(
			body.password.toLowerCase().trim(),
			user.password,
		);
		//console.log('passhash', hashPassw);
		if (!hashPassw) {
			throw new UnauthorizedException(
				"This email or password is wrong",
				"This email or password is wrong",
			);
		}

		const accessToken = await this.verificationService.createToken(
			{
				email: body.email,
				type: "access",
			},
			"30m",
		);

		const refreshToken = await this.verificationService.createToken(
			{
				email: user.email,
				type: "refresh",
			},
			"60m",
		);

		await this.redisClient.setEx(accessToken, 10000, accessToken);
		await this.redisClient.setEx(refreshToken, 50000, refreshToken);

		return { accessToken, refreshToken };
	}

	async validateUser(data: ITokenPayload): Promise<UserBaseDto> {
		const user = await this.userModel.findOne({
			email: data.email,
		});
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}

	async refreshTokens(
		refreshToken: string,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const user = await this.verifyRefreshToken(refreshToken);
		const newAccessToken = await this.verificationService.createToken(
			{
				email: user.email,
				type: "access",
			},
			"60m",
		);

		await this.redisClient.setEx(newAccessToken, 10000, newAccessToken);
		return { accessToken: newAccessToken, refreshToken };
	}

	public async verifyRefreshToken(
		refreshToken: string,
	): Promise<Partial<UserBaseDto>> {
		try {
			const decodedToken =
				await this.verificationService.verifyToken(refreshToken);
			const user = await this.userService.userFindOneEmail(decodedToken.email);
			return user;
		} catch (error) {
			throw new HttpException(
				"Invalid or expired refresh token",
				HttpStatus.UNAUTHORIZED,
			);
		}
	}
}
