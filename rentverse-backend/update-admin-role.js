const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateAdminRole() {
  try {
    console.log('Updating admin@rentverse.com role to ADMIN...')
    
    const user = await prisma.user.update({
      where: { email: 'admin@rentverse.com' },
      data: { role: 'ADMIN' }
    })
    
    console.log('✅ Success! Admin role updated:')
    console.log('  Email:', user.email)
    console.log('  Name:', user.name)
    console.log('  Role:', user.role)
    
  } catch (error) {
    console.error('❌ Error updating admin role:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminRole()
