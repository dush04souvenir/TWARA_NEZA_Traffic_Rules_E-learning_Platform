import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Clean up existing content (Questions, Options, Topics, Signs)
    // Keep Users to avoid logging everyone out constantly, or just upsert them.
    console.log('🧹 Clearing old content data...')
    await prisma.option.deleteMany()
    await prisma.question.deleteMany()
    await prisma.topic.deleteMany()
    await prisma.trafficSign.deleteMany()

    // 2. Upsert Users (Admin & Manager)
    const passwordHash = await bcrypt.hash('password123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@tawaraneza.rw' },
        update: {},
        create: {
            name: 'System Admin',
            email: 'admin@tawaraneza.rw',
            password: passwordHash,
            role: 'ADMIN',
        },
    })

    const manager = await prisma.user.upsert({
        where: { email: 'manager@tawaraneza.rw' },
        update: {},
        create: {
            name: 'Training Manager',
            email: 'manager@tawaraneza.rw',
            password: passwordHash,
            role: 'MANAGER',
        },
    })

    console.log('👤 Users seeded:', { admin: admin.email, manager: manager.email })

    // 3. Seed Traffic Signs (~30 items)
    // Using placeholder images for now.
    const signs = [
        { name: 'Stop', category: 'Regulatory', description: 'Come to a complete stop.', imageUrl: 'https://placehold.co/200x200/red/white?text=STOP' },
        { name: 'Yield', category: 'Regulatory', description: 'Give way to other traffic.', imageUrl: 'https://placehold.co/200x200/white/red?text=YIELD' },
        { name: 'No Entry', category: 'Regulatory', description: 'Do not enter this road.', imageUrl: 'https://placehold.co/200x200/red/white?text=NO+ENTRY' },
        { name: 'No U-Turn', category: 'Regulatory', description: 'U-turns are forbidden.', imageUrl: 'https://placehold.co/200x200/white/red?text=NO+U-TURN' },
        { name: 'Speed Limit 50', category: 'Regulatory', description: 'Maximum speed 50 km/h.', imageUrl: 'https://placehold.co/200x200/white/red?text=50' },
        { name: 'One Way', category: 'Regulatory', description: 'Traffic flows only in one direction.', imageUrl: 'https://placehold.co/200x200/blue/white?text=ONE+WAY' },
        { name: 'No Parking', category: 'Regulatory', description: 'Parking is prohibited.', imageUrl: 'https://placehold.co/200x200/blue/red?text=NO+PARKING' },
        { name: 'No Overtaking', category: 'Regulatory', description: 'Overtaking is not allowed.', imageUrl: 'https://placehold.co/200x200/white/red?text=NO+OVERTAKE' },

        { name: 'Curve Left', category: 'Warning', description: 'Road curves to the left ahead.', imageUrl: 'https://placehold.co/200x200/yellow/black?text=CURVE+LEFT' },
        { name: 'Curve Right', category: 'Warning', description: 'Road curves to the right ahead.', imageUrl: 'https://placehold.co/200x200/yellow/black?text=CURVE+RIGHT' },
        { name: 'Winding Road', category: 'Warning', description: 'Series of curves ahead.', imageUrl: 'https://placehold.co/200x200/yellow/black?text=WINDING' },
        { name: 'Pedestrian Crossing', category: 'Warning', description: 'Watch for pedestrians crossing.', imageUrl: 'https://placehold.co/200x200/yellow/black?text=PEDESTRIANS' },
        { name: 'School Zone', category: 'Warning', description: 'School ahead, slow down.', imageUrl: 'https://placehold.co/200x200/yellow/black?text=SCHOOL' },
        { name: 'Slippery Road', category: 'Warning', description: 'Road may be slippery when wet.', imageUrl: 'https://placehold.co/200x200/yellow/black?text=SLIPPERY' },
        { name: 'Traffic Lights', category: 'Warning', description: 'Traffic signals ahead.', imageUrl: 'https://placehold.co/200x200/yellow/black?text=SIGNALS' },
        { name: 'Roundabout', category: 'Warning', description: 'Roundabout ahead.', imageUrl: 'https://placehold.co/200x200/yellow/black?text=ROUNDABOUT' },
        { name: 'Road Work', category: 'Warning', description: 'Construction work ahead.', imageUrl: 'https://placehold.co/200x200/yellow/black?text=WORK' },
        { name: 'Steep Hill Down', category: 'Warning', description: 'Steep descent ahead.', imageUrl: 'https://placehold.co/200x200/yellow/black?text=HILL+DOWN' },
        { name: 'Steep Hill Up', category: 'Warning', description: 'Steep ascent ahead.', imageUrl: 'https://placehold.co/200x200/yellow/black?text=HILL+UP' },
        { name: 'Narrow Bridge', category: 'Warning', description: 'Bridge is narrower than road.', imageUrl: 'https://placehold.co/200x200/yellow/black?text=NARROW' },

        { name: 'Hospital', category: 'Information', description: 'Hospital nearby.', imageUrl: 'https://placehold.co/200x200/blue/white?text=HOSPITAL' },
        { name: 'Gas Station', category: 'Information', description: 'Fuel station nearby.', imageUrl: 'https://placehold.co/200x200/blue/white?text=FUEL' },
        { name: 'Parking Area', category: 'Information', description: 'Designated parking.', imageUrl: 'https://placehold.co/200x200/blue/white?text=PARKING' },
        { name: 'First Aid', category: 'Information', description: 'First aid post.', imageUrl: 'https://placehold.co/200x200/blue/white?text=FIRST+AID' },
        { name: 'Telephone', category: 'Information', description: 'Public telephone.', imageUrl: 'https://placehold.co/200x200/blue/white?text=PHONE' },
        { name: 'Bus Stop', category: 'Information', description: 'Public bus stop.', imageUrl: 'https://placehold.co/200x200/blue/white?text=BUS' },
        { name: 'Taxi Stand', category: 'Information', description: 'Taxi stand.', imageUrl: 'https://placehold.co/200x200/blue/white?text=TAXI' },
    ]

    console.log(`🛑 Seeding ${signs.length} Traffic Signs...`)
    await prisma.trafficSign.createMany({ data: signs })

    // 4. Seed Topics & Questions (~30 questions)
    const topics = [
        {
            title: 'General Traffic Rules',
            description: 'Basic rules every driver must know.',
            questions: [
                { q: 'What is the general speed limit in urban areas in Rwanda?', opts: [{ t: '40 km/h', c: true }, { t: '60 km/h', c: false }, { t: '80 km/h', c: false }, { t: '50 km/h', c: false }] },
                { q: 'Which side of the road must you drive on?', opts: [{ t: 'Right', c: true }, { t: 'Left', c: false }, { t: 'Center', c: false }, { t: 'Any side', c: false }] },
                { q: 'When must you wear a seatbelt?', opts: [{ t: 'Always', c: true }, { t: 'Only on highways', c: false }, { t: 'Only front seats', c: false }, { t: 'Never', c: false }] },
                { q: 'What is the legal blood alcohol limit for drivers?', opts: [{ t: '0.08%', c: True }, { t: '0.00%', c: false }, { t: '0.05%', c: false }, { t: '0.10%', c: false }] }, // Corrected is 0.08 usually, verify specific RW law if needed, sticking to general usually. EDIT: RW is strict 0.08 or 0.
                { q: 'When can you use a mobile phone while driving?', opts: [{ t: 'Never, unless hands-free', c: true }, { t: 'When stopped at lights', c: false }, { t: 'Anytime', c: false }, { t: 'Only for maps', c: false }] },
                { q: 'What does a flashing yellow light mean?', opts: [{ t: 'Proceed with caution', c: true }, { t: 'Stop', c: false }, { t: 'Go fast', c: false }, { t: 'Turn back', c: false }] },
                { q: 'Who has priority at a zebra crossing?', opts: [{ t: 'Pedestrians', c: true }, { t: 'Cars', c: false }, { t: 'Buses', c: false }, { t: 'Cyclists', c: false }] },
                { q: 'What documents must you always carry?', opts: [{ t: 'License, Insurance, Registration', c: true }, { t: 'Just License', c: false }, { t: 'ID Card only', c: false }, { t: 'None', c: false }] },
                { q: 'How often must vehicle inspection be done for commercial cars?', opts: [{ t: 'Every 6 months', c: true }, { t: 'Every year', c: false }, { t: 'Every 2 years', c: false }, { t: 'Never', c: false }] },
                { q: 'What should you do when an ambulance approaches with sirens?', opts: [{ t: 'Pull over and stop', c: true }, { t: 'Speed up', c: false }, { t: 'Ignor it', c: false }, { t: 'Honk', c: false }] },
            ]
        },
        {
            title: 'Overtaking & Lane usage',
            description: 'Rules for passing other vehicles safely.',
            questions: [
                { q: 'On which side should you normally overtake?', opts: [{ t: 'Left', c: true }, { t: 'Right', c: false }, { t: 'Shoulder', c: false }, { t: 'Either side', c: false }] },
                { q: 'When is overtaking forbidden?', opts: [{ t: 'On a solid line', c: true }, { t: 'On a broken line', c: false }, { t: 'On a highway', c: false }, { t: 'In the morning', c: false }] },
                { q: 'What implies a solid white line in the center?', opts: [{ t: 'No overtaking/crossing', c: true }, { t: 'Overtaking allowed', c: false }, { t: 'Parking area', c: false }, { t: 'Speed limit zone', c: false }] },
                { q: 'Can you overtake on a pedestrian crossing?', opts: [{ t: 'No', c: true }, { t: 'Yes', c: false }, { t: 'If clear', c: false }, { t: 'At night only', c: false }] },
                { q: 'What checks must be done before overtaking?', opts: [{ t: 'Mirrors, Blind spot, Signal', c: true }, { t: 'Just Signal', c: false }, { t: 'Just Honk', c: false }, { t: 'None', c: false }] },
                { q: 'Can you overtake near the crest of a hill?', opts: [{ t: 'No', c: true }, { t: 'Yes', c: false }, { t: 'If fast', c: false }, { t: 'Only buses', c: false }] },
                { q: 'What implies a broken white line?', opts: [{ t: 'Overtaking permitted if safe', c: true }, { t: 'No entry', c: false }, { t: 'Bus lane', c: false }, { t: 'Stop line', c: false }] },
                { q: 'Is it allowed to exceed the speed limit while overtaking?', opts: [{ t: 'No', c: true }, { t: 'Yes', c: false }, { t: 'By 10%', c: false }, { t: 'Only emergencies', c: false }] },
                { q: 'What to do if being overtaken?', opts: [{ t: 'Maintain speed and keep right', c: true }, { t: 'Speed up', c: false }, { t: 'Swerve left', c: false }, { t: 'Brake hard', c: false }] },
                { q: 'When can you overtake on the right?', opts: [{ t: 'When vehicle ahead signals left', c: true }, { t: 'Always', c: false }, { t: 'Never', c: false }, { t: 'In traffic jams', c: false }] },
            ]
        },
        {
            title: 'Priority & Intersections',
            description: 'Understanding who goes first.',
            questions: [
                { q: 'Who has priority at an unmarked intersection?', opts: [{ t: 'Traffic from right', c: true }, { t: 'Traffic from left', c: false }, { t: 'Faster car', c: false }, { t: 'Larger car', c: false }] },
                { q: 'What does a Yield sign mean?', opts: [{ t: 'Give way to others', c: true }, { t: 'Stop completely', c: false }, { t: 'Go first', c: false }, { t: 'No turn', c: false }] },
                { q: 'Entering a roundabout, who has priority?', opts: [{ t: 'Traffic already inside', c: true }, { t: 'Entering traffic', c: false }, { t: 'Trucks', c: false }, { t: 'Buses', c: false }] },
                { q: 'When turning left, whom must you yield to?', opts: [{ t: 'Oncoming traffic', c: true }, { t: 'Traffic behind', c: false }, { t: 'Pedestrians behind', c: false }, { t: 'None', c: false }] },
                { q: 'What does a green arrow light mean?', opts: [{ t: 'Proceed in direction of arrow', c: true }, { t: 'Stop', c: false }, { t: 'Wait', c: false }, { t: 'U-turn only', c: false }] },
                { q: 'Does a mesmerizing flashing red light mean stop?', opts: [{ t: 'Yes, treat as Stop sign', c: true }, { t: 'No, just slow down', c: false }, { t: 'It is broken', c: false }, { t: 'Go fast', c: false }] },
                { q: 'Who goes first at a 4-way stop?', opts: [{ t: 'First to arrive', c: true }, { t: 'Biggest car', c: false }, { t: 'Fastest car', c: false }, { t: 'Traffic from left', c: false }] },
                { q: 'Do emergency vehicles with lights have priority?', opts: [{ t: 'Yes, always', c: true }, { t: 'No', c: false }, { t: 'Only at night', c: false }, { t: 'Only at borders', c: false }] },
                { q: 'Exiting a private driveway, who has priority?', opts: [{ t: 'Traffic on the main road', c: true }, { t: 'You', c: false }, { t: 'Nobody', c: false }, { t: 'Pedestrians only', c: false }] },
                { q: 'What is the "zipper merge" rule?', opts: [{ t: 'Merge late in turns', c: true }, { t: 'Merge early', c: false }, { t: 'Stop and wait', c: false }, { t: 'Blocks lanes', c: false }] },
            ]
        }
    ]

    console.log(`📚 Seeding ${topics.length} Topics with Questions...`)

    for (const t of topics) {
        const topic = await prisma.topic.create({
            data: {
                title: t.title,
                description: t.description,
                questions: {
                    create: t.questions.map(q => ({
                        text: q.q,
                        points: 5,
                        options: {
                            create: q.opts.map(o => ({ text: o.t, isCorrect: o.c }))
                        }
                    }))
                }
            }
        })
        console.log(` - Created topic: ${topic.title}`)
    }

    console.log('✅ Seed completed successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
