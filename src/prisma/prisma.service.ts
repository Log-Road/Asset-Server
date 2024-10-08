import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CATEGORY } from '../types/category.type';
import { CONTEST_STATUS, PROJECT_STATUS } from '../types/status.type';
import { PrismaClient, Projects } from './client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    super({
      datasources: {
        db: {
          url: configService.get('POSTGRESQL_DB'),
        },
      },
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async findAllContests() {
    return await this.contests.findMany({
      select: {
        id: true,
        name: true,
        start_date: true,
        end_date: true,
      },
      orderBy: { start_date: 'desc' },
    });
  }

  async findContestByDateBefore(now: Date) {
    return await this.contests.findMany({
      where: {
        end_date: { lt: now },
      },
      orderBy: [{ end_date: 'desc' }, { start_date: 'desc' }],
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findAllAwardsByContestId(contestId: string) {
    return await this.awards.findMany({
      where: { contest_id: contestId },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findAllProjects() {
    const projects = await this.projects.findMany();

    return projects.map((project) => {
      const {
        id,
        contest_id,
        name,
        image,
        members,
        skills,
        status,
        auth_category,
        introduction,
        description,
        video_link,
        created_at,
      } = project;

      return {
        id,
        contestId: contest_id,
        name,
        image,
        members,
        skills,
        status: PROJECT_STATUS[status],
        authCategory: CATEGORY[auth_category],
        introduction,
        description,
        videoLink: video_link,
        createdAt: created_at,
      };
    });
  }

  async countLikesByProjectId(projectId: string) {
    return await this.like.count({
      where: { project_id: projectId },
    });
  }

  async findOneLikeByProjectIdAndUserId(projectId: string, userId: string) {
    return await this.like.findUnique({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId,
        },
      },
    });
  }

  async findContestsOnGoing() {
    return await this.contests.findMany({
      where: {
        status: CONTEST_STATUS.NOW,
      },
      select: {
        id: true,
        name: true,
        start_date: true,
        end_date: true,
      },
      orderBy: { start_date: 'desc' },
    });
  }

  async findAllProjectByContestId(contestId: string) {
    const projects = await this.projects.findMany({
      where: { contest_id: contestId },
      orderBy: { created_at: 'desc' },
    });

    const organizedProjects = projects.map((project) => {
      const {
        id,
        contest_id,
        name,
        image,
        members,
        skills,
        status,
        auth_category,
        introduction,
        description,
        video_link,
        created_at,
      } = project;

      return {
        id,
        contestId: contest_id,
        name,
        image,
        members,
        skills,
        status,
        authCategory: CATEGORY[auth_category],
        introduction,
        description,
        videoLink: video_link,
        createdAt: created_at,
      };
    });
    return organizedProjects;
  }

  async findPagedProjectByContestId(contestId: string, page: number) {
    const projects = await this.projects.findMany({
      where: { contest_id: contestId },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * 12,
      take: 12,
    });

    return projects.map((project) => {
      const {
        id,
        contest_id,
        name,
        image,
        members,
        skills,
        status,
        auth_category,
        introduction,
        description,
        video_link,
        created_at,
      } = project;

      return {
        id,
        contestId: contest_id,
        name,
        image,
        members,
        skills,
        status: PROJECT_STATUS[status],
        authCategory: CATEGORY[auth_category],
        introduction,
        description,
        videoLink: video_link,
        createdAt: created_at,
      };
    });
  }

  async findAllLikeByProjectId(projectId: string) {
    return await this.like.findMany({
      where: { project_id: projectId },
      select: { user_id: true },
    });
  }

  async findOneProjectByProjectId(id: string) {
    const project = await this.projects.findUnique({ where: { id } });

    const {
      contest_id,
      name,
      image,
      members,
      skills,
      status,
      auth_category,
      introduction,
      description,
      video_link,
      created_at,
    } = project;

    return {
      id,
      contestId: contest_id,
      name,
      image,
      members,
      skills,
      status: PROJECT_STATUS[status],
      authCategory: CATEGORY[auth_category],
      introduction,
      description,
      videoLink: video_link,
      createdAt: created_at,
    };
  }

  async findOneContestNameAndIdByContestId(id: string) {
    return await this.contests.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
  }

  async findAllProjectsContainsKeyword(keyword: string, page: number) {
    const projects = await this.projects.findMany({
      where: { name: { contains: keyword, mode: 'insensitive' } },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * 12,
      take: 12,
    });

    return projects.map((project) => {
      const {
        id,
        contest_id,
        name,
        image,
        members,
        skills,
        status,
        auth_category,
        introduction,
        description,
        video_link,
        created_at,
      } = project;

      return {
        id,
        contestId: contest_id,
        name,
        image,
        members,
        skills,
        status: PROJECT_STATUS[status],
        authCategory: CATEGORY[auth_category],
        introduction,
        description,
        videoLink: video_link,
        createdAt: created_at,
      };
    });
  }

  async saveProject(
    project: {
      name: string;
      image: string;
      members: string[];
      skills: string[];
      authCategory: CATEGORY;
      introduction: string;
      description: string;
      videoLink: string;
    },
    contest_id: string,
  ): Promise<Projects> {
    try {
      return await this.projects.create({
        data: {
          auth_category: project.authCategory,
          video_link: project.videoLink,
          ...project,
          contest: {
            connect: { id: contest_id },
          },
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  async existByUserIdAndContestId(userId: string, contestId: string) {
    const projectCnt = await this.projects.findFirst({
      where: {
        members: {
          has: userId,
        },
        contest_id: contestId,
      },
    });

    return Boolean(projectCnt);
  }
}
