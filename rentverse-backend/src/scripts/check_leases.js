const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Find the property first
    const property = await prisma.property.findFirst({
        where: {
            title: { contains: 'The Clio Residences' }
        }
    });

    if (!property) {
        console.log('Property not found');
        return;
    }

    console.log(`Property Found: ${property.id} (${property.title})`);

    // Find all leases for this property
    const leases = await prisma.lease.findMany({
        where: {
            propertyId: property.id
        },
        include: {
            tenant: true
        }
    });

    console.log('--- Existing Leases ---');
    leases.forEach(lease => {
        console.log(`ID: ${lease.id}`);
        console.log(`Tenant: ${lease.tenant.email} (${lease.tenant.name})`);
        console.log(`Dates: ${lease.startDate.toISOString()} to ${lease.endDate.toISOString()}`);
        console.log(`Status: ${lease.status}`);
        console.log('-----------------------');
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
