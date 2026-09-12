const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ApplicationDao {
  async createApplication(jobId, answersData) {
    return prisma.application.create({
      data: {
        jobId,
        answers: {
          create: answersData.map(ans => ({
            questionId: ans.questionId,
            value: ans.value
          }))
        }
      },
      include: {
        job: true,
        answers: true
      }
    });
  }

  async getAllApplications() {
    return prisma.application.findMany({
      include: {
        job: true,
        answers: true
      },
      orderBy: { appliedAt: 'desc' }
    });
  }
  
  async getApplicationByJobId(jobId) {
    return prisma.application.findFirst({
      where: { jobId }
    });
  }
}

module.exports = new ApplicationDao();
