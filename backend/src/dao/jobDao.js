const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class JobDao {
  async getAllJobs() {
    return prisma.job.findMany({
      include: { questions: true }
    });
  }

  async getJobById(id) {
    return prisma.job.findUnique({
      where: { id },
      include: { questions: true }
    });
  }
}

module.exports = new JobDao();
