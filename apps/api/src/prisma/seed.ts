import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial database content with 50+ fashion products...');

  // 1. Permissions
  const permissionsData = [
    { code: 'products.read', description: 'View products and catalog' },
    { code: 'products.write', description: 'Create, edit, delete products' },
    { code: 'categories.read', description: 'View categories' },
    { code: 'categories.write', description: 'Create, edit, delete categories' },
    { code: 'orders.read', description: 'View orders' },
    { code: 'orders.write', description: 'Update order status and notes' },
    { code: 'discounts.read', description: 'View discounts' },
    { code: 'discounts.write', description: 'Manage discounts and promo codes' },
    { code: 'banners.read', description: 'View marketing banners' },
    { code: 'banners.write', description: 'Manage marketing banners' },
    { code: 'messages.read', description: 'View contact form inbox' },
    { code: 'messages.write', description: 'Manage/reply to contact messages' },
    { code: 'settings.read', description: 'View store settings' },
    { code: 'settings.write', description: 'Update store settings' },
    { code: 'users.read', description: 'View admin users and roles' },
    { code: 'users.write', description: 'Invite and manage admin users' },
    { code: 'activity_logs.read', description: 'View activity audit logs' },
    { code: 'analytics.read', description: 'View dashboard analytics & sales reports' },
  ];

  const permissionsMap: Record<string, string> = {};
  for (const p of permissionsData) {
    const perm = await prisma.permission.upsert({
      where: { code: p.code },
      update: { description: p.description },
      create: p,
    });
    permissionsMap[p.code] = perm.id;
  }

  // 2. Roles
  const rolesData = [
    {
      name: 'Owner',
      description: 'Super administrator with full access',
      permissions: Object.keys(permissionsMap),
    },
    {
      name: 'Manager',
      description: 'Store manager with catalog and order management access',
      permissions: [
        'products.read', 'products.write',
        'categories.read', 'categories.write',
        'orders.read', 'orders.write',
        'discounts.read', 'discounts.write',
        'banners.read', 'banners.write',
        'messages.read', 'messages.write',
        'settings.read',
        'activity_logs.read',
        'analytics.read',
      ],
    },
    {
      name: 'Staff',
      description: 'Catalog staff managing products and inventory',
      permissions: [
        'products.read', 'products.write',
        'categories.read', 'categories.write',
      ],
    },
    {
      name: 'Support',
      description: 'Customer support staff processing orders',
      permissions: [
        'products.read',
        'categories.read',
        'orders.read', 'orders.write',
        'messages.read', 'messages.write',
      ],
    },
  ];

  const rolesMap: Record<string, string> = {};
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: { name: r.name, description: r.description },
    });
    rolesMap[r.name] = role.id;

    for (const code of r.permissions) {
      const permId = permissionsMap[code];
      if (permId) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: { roleId: role.id, permissionId: permId },
          },
          update: {},
          create: { roleId: role.id, permissionId: permId },
        });
      }
    }
  }

  // 3. Admin User
  const defaultAdminPassword = await bcrypt.hash('AdminPass123!', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@fashionstore.com' },
    update: {},
    create: {
      name: 'Store Owner',
      email: 'admin@fashionstore.com',
      passwordHash: defaultAdminPassword,
      roleId: rolesMap['Owner'],
      isActive: true,
    },
  });

  // 4. Categories
  const categoriesData = [
    {
      name: 'Tops & Shirts',
      slug: 'tops',
      description: 'Tailored shirts, casual tees, and premium knitwear',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
      displayOrder: 1,
    },
    {
      name: 'Outerwear',
      slug: 'outerwear',
      description: 'Minimalist jackets, coats, and blazers',
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
      displayOrder: 2,
    },
    {
      name: 'Bottoms',
      slug: 'bottoms',
      description: 'Relaxed trousers, classic denim, and structured shorts',
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
      displayOrder: 3,
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Leather bags, headwear, and minimal jewelry',
      imageUrl: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?q=80&w=800&auto=format&fit=crop',
      displayOrder: 4,
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    categoryMap[c.slug] = cat.id;
  }

  // 5. Collections
  const collectionsData = [
    {
      name: 'Summer Drop 2026',
      slug: 'summer-drop-2026',
      description: 'Breezy linens, earthy tones, and sun-ready silhouettes',
      bannerImageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Minimalist Essentials',
      slug: 'minimalist-essentials',
      description: 'Timeless wardrobe staples built for everyday versatility',
      bannerImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  for (const col of collectionsData) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      update: col,
      create: col,
    });
  }

  // 6. Marketing Banners
  const existingBanners = await prisma.banner.count();
  if (existingBanners === 0) {
    await prisma.banner.create({
      data: {
        placement: 'hero',
        title: 'Summer 2026 Capsule Collection',
        subtitle: 'Effortless silhouettes crafted in sustainable natural linens.',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
        linkUrl: '/products?category=tops',
        displayOrder: 1,
      },
    });
  }

  // 7. Comprehensive 52 Products Dataset
  const sampleProducts = [
    // --- TOPS & SHIRTS (16 Products) ---
    {
      name: 'Oversized Linen Shirt',
      slug: 'oversized-linen-shirt',
      cat: 'tops',
      price: 229000,
      sku: 'TS-OLS',
      desc: 'Crafted from 100% breathable organic linen. Features a relaxed collar, chest pocket, and mother-of-pearl buttons. Ideal for warm weather layering.',
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop',
      ],
      vars: [
        { sku: 'TS-OLS-M-BLK', size: 'M', color: 'Black', hex: '#000000', stock: 15 },
        { sku: 'TS-OLS-L-BLK', size: 'L', color: 'Black', hex: '#000000', stock: 8 },
        { sku: 'TS-OLS-M-WHT', size: 'M', color: 'White', hex: '#FFFFFF', stock: 20 },
        { sku: 'TS-OLS-L-WHT', size: 'L', color: 'White', hex: '#FFFFFF', stock: 0 },
      ],
    },
    {
      name: 'Relaxed Cotton Poplin Shirt',
      slug: 'relaxed-cotton-poplin-shirt',
      cat: 'tops',
      price: 259000,
      sku: 'TS-RCP',
      desc: 'Crisp 100% cotton poplin cut with a modern drop-shoulder silhouette. Button-down front with curved hemline.',
      images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop'],
      vars: [
        { sku: 'TS-RCP-S-BLU', size: 'S', color: 'Sky Blue', hex: '#87CEEB', stock: 12 },
        { sku: 'TS-RCP-M-BLU', size: 'M', color: 'Sky Blue', hex: '#87CEEB', stock: 3 }, // Low stock
        { sku: 'TS-RCP-L-WHT', size: 'L', color: 'White', hex: '#FFFFFF', stock: 18 },
      ],
    },
    {
      name: 'Silk-Blend Draped Blouse',
      slug: 'silk-blend-draped-blouse',
      cat: 'tops',
      price: 389000,
      sku: 'TS-SDB',
      desc: 'Lustrous silk blend with fluid drape, boat neckline, and subtle gathers at the shoulders. Elegant evening option.',
      images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop'],
      vars: [
        { sku: 'TS-SDB-S-CRM', size: 'S', color: 'Cream', hex: '#FFFDD0', stock: 6 },
        { sku: 'TS-SDB-M-CRM', size: 'M', color: 'Cream', hex: '#FFFDD0', stock: 2 }, // Low stock
      ],
    },
    {
      name: 'Heavyweight Boxy Tee',
      slug: 'heavyweight-boxy-tee',
      cat: 'tops',
      price: 149000,
      sku: 'TS-HBT',
      desc: '260 GSM combed cotton tee with dense, durable texture and a clean boxy drape. Reinforced crew neck collar.',
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'],
      vars: [
        { sku: 'TS-HBT-M-CHR', size: 'M', color: 'Charcoal', hex: '#36454F', stock: 25 },
        { sku: 'TS-HBT-L-CHR', size: 'L', color: 'Charcoal', hex: '#36454F', stock: 14 },
        { sku: 'TS-HBT-XL-WHT', size: 'XL', color: 'White', hex: '#FFFFFF', stock: 4 }, // Low stock
      ],
    },
    {
      name: 'Ribbed Mock Neck Top',
      slug: 'ribbed-mock-neck-top',
      cat: 'tops',
      price: 189000,
      sku: 'TS-RMN',
      desc: 'Fine vertical ribbed knit with medium stretch and standing mock neck collar. Versatile standalone or layering piece.',
      images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop'],
      vars: [
        { sku: 'TS-RMN-S-BLK', size: 'S', color: 'Black', hex: '#000000', stock: 10 },
        { sku: 'TS-RMN-M-BEG', size: 'M', color: 'Beige', hex: '#F5F5DC', stock: 0 }, // Out of stock
      ],
    },
    {
      name: 'Striped Nautical Long Sleeve',
      slug: 'striped-nautical-long-sleeve',
      cat: 'tops',
      price: 219000,
      sku: 'TS-SNL',
      desc: 'Classic Breton stripe shirt crafted from heavy jersey cotton. Clean boat neck collar with straight cuffs.',
      images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop'],
      vars: [
        { sku: 'TS-SNL-M-NVY', size: 'M', color: 'Navy/White', hex: '#000080', stock: 11 },
        { sku: 'TS-SNL-L-NVY', size: 'L', color: 'Navy/White', hex: '#000080', stock: 9 },
      ],
    },
    {
      name: 'Chiffon Pleated Accent Shirt',
      slug: 'chiffon-pleated-accent-shirt',
      cat: 'tops',
      price: 299000,
      sku: 'TS-CPA',
      desc: 'Semi-sheer chiffon paneling with delicate pin-tuck pleats along the bib. Covered button placket.',
      images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'TS-CPA-M-WHT', size: 'M', color: 'Off-White', hex: '#FAF9F6', stock: 8 }],
    },
    {
      name: 'Merino Wool Knit Polo',
      slug: 'merino-wool-knit-polo',
      cat: 'tops',
      price: 449000,
      sku: 'TS-MWK',
      desc: 'Superfine 100% Australian Merino wool knit into a refined open-collar polo silhouette.',
      images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop'],
      vars: [
        { sku: 'TS-MWK-M-OLV', size: 'M', color: 'Olive', hex: '#556B2F', stock: 5 }, // Low stock
        { sku: 'TS-MWK-L-OLV', size: 'L', color: 'Olive', hex: '#556B2F', stock: 7 },
      ],
    },
    {
      name: 'Soft Modal V-Neck T-Shirt',
      slug: 'soft-modal-v-neck-t-shirt',
      cat: 'tops',
      price: 159000,
      sku: 'TS-SMV',
      desc: 'Silky smooth beechwood modal jersey with a shallow V-neck cut and refined shoulder seams.',
      images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop'],
      vars: [
        { sku: 'TS-SMV-S-BLK', size: 'S', color: 'Black', hex: '#000000', stock: 22 },
        { sku: 'TS-SMV-M-BLK', size: 'M', color: 'Black', hex: '#000000', stock: 15 },
      ],
    },
    {
      name: 'Structured Utility Overshirt',
      slug: 'structured-utility-overshirt',
      cat: 'tops',
      price: 329000,
      sku: 'TS-SUO',
      desc: 'Heavy cotton canvas shirt jacket with dual chest flap pockets and horn buttons. Perfect for transitional outerwear layering.',
      images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'],
      vars: [
        { sku: 'TS-SUO-M-KHK', size: 'M', color: 'Khaki', hex: '#C3B091', stock: 12 },
        { sku: 'TS-SUO-L-KHK', size: 'L', color: 'Khaki', hex: '#C3B091', stock: 2 }, // Low stock
      ],
    },
    {
      name: 'Cropped Linen Button-Down',
      slug: 'cropped-linen-button-down',
      cat: 'tops',
      price: 239000,
      sku: 'TS-CLB',
      desc: 'High-waisted cropped hem linen top with tortoiseshell buttons and short cuffed sleeves.',
      images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'TS-CLB-S-SGE', size: 'S', color: 'Sage', hex: '#9CAF88', stock: 9 }],
    },
    {
      name: 'Cashmere-Blend Crewneck Sweater',
      slug: 'cashmere-blend-crewneck-sweater',
      cat: 'tops',
      price: 599000,
      sku: 'TS-CBC',
      desc: 'Luxurious Mongolian cashmere and organic cotton blend with ribbed collar, hem, and cuffs.',
      images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop'],
      vars: [
        { sku: 'TS-CBC-M-CML', size: 'M', color: 'Camel', hex: '#C19A6B', stock: 4 }, // Low stock
        { sku: 'TS-CBC-L-CML', size: 'L', color: 'Camel', hex: '#C19A6B', stock: 6 },
      ],
    },
    {
      name: 'Sleeveless Draped Satin Top',
      slug: 'sleeveless-draped-satin-top',
      cat: 'tops',
      price: 279000,
      sku: 'TS-SDS',
      desc: 'Glossy satin tank top with gentle cowl neckline and high side vents. Effortless evening wear.',
      images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'TS-SDS-M-EMR', size: 'M', color: 'Emerald', hex: '#50C878', stock: 11 }],
    },
    {
      name: 'Band Collar Oxford Shirt',
      slug: 'band-collar-oxford-shirt',
      cat: 'tops',
      price: 269000,
      sku: 'TS-BCO',
      desc: 'Mandarin band collar long sleeve shirt in durable pinpoint Oxford weave cotton.',
      images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'TS-BCO-L-WHT', size: 'L', color: 'White', hex: '#FFFFFF', stock: 14 }],
    },
    {
      name: 'Waffle-Knit Henley Top',
      slug: 'waffle-knit-henley-top',
      cat: 'tops',
      price: 199000,
      sku: 'TS-WKH',
      desc: 'Thermal waffle texture cotton jersey with 3-button placket and vintage wash finish.',
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'TS-WKH-M-GRY', size: 'M', color: 'Heather Grey', hex: '#D3D3D3', stock: 16 }],
    },
    {
      name: 'Sheer Organza Layered Blouse',
      slug: 'sheer-organza-layered-blouse',
      cat: 'tops',
      price: 349000,
      sku: 'TS-SOL',
      desc: 'Voluminous sheer organza outer layer over a matching opaque camisole lining.',
      images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'TS-SOL-S-BLK', size: 'S', color: 'Black', hex: '#000000', stock: 3 }], // Low stock
    },

    // --- OUTERWEAR (12 Products) ---
    {
      name: 'Structured Boxy Blazer',
      slug: 'structured-boxy-blazer',
      cat: 'outerwear',
      price: 489000,
      sku: 'OW-SBB',
      desc: 'Modern relaxed blazer with padded shoulders, notched lapel, and welt pockets. Perfect for smart-casual dressing.',
      images: [
        'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
      ],
      vars: [
        { sku: 'OW-SBB-S-BEG', size: 'S', color: 'Beige', hex: '#F5F5DC', stock: 10 },
        { sku: 'OW-SBB-M-BEG', size: 'M', color: 'Beige', hex: '#F5F5DC', stock: 12 },
        { sku: 'OW-SBB-L-BLK', size: 'L', color: 'Black', hex: '#000000', stock: 4 }, // Low stock
      ],
    },
    {
      name: 'Double-Breasted Trench Coat',
      slug: 'double-breasted-trench-coat',
      cat: 'outerwear',
      price: 899000,
      sku: 'OW-DBT',
      desc: 'Iconic storm flap double-breasted trench in weather-resistant cotton twill with waist tie belt.',
      images: ['https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop'],
      vars: [
        { sku: 'OW-DBT-M-KHK', size: 'M', color: 'Classic Khaki', hex: '#C3B091', stock: 7 },
        { sku: 'OW-DBT-L-KHK', size: 'L', color: 'Classic Khaki', hex: '#C3B091', stock: 2 }, // Low stock
      ],
    },
    {
      name: 'Cropped Twill Jacket',
      slug: 'cropped-twill-jacket',
      cat: 'outerwear',
      price: 399000,
      sku: 'OW-CTJ',
      desc: 'Heavy cotton twill jacket cropped at the natural waist with silver hardware zip closure.',
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'OW-CTJ-S-OLV', size: 'S', color: 'Olive', hex: '#556B2F', stock: 9 }],
    },
    {
      name: 'Wool-Blend Oversized Coat',
      slug: 'wool-blend-oversized-coat',
      cat: 'outerwear',
      price: 1299000,
      sku: 'OW-WBO',
      desc: 'Heavy double-faced wool blend tailored coat with dropped shoulders and deep welt side pockets.',
      images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop'],
      vars: [
        { sku: 'OW-WBO-M-CML', size: 'M', color: 'Camel', hex: '#C19A6B', stock: 5 }, // Low stock
        { sku: 'OW-WBO-L-BLK', size: 'L', color: 'Black', hex: '#000000', stock: 3 }, // Low stock
      ],
    },
    {
      name: 'Padded Minimalist Puffer Jacket',
      slug: 'padded-minimalist-puffer-jacket',
      cat: 'outerwear',
      price: 749000,
      sku: 'OW-PMP',
      desc: 'Matte water-repellent shell insulated with lightweight recycled down fill. Stand collar with concealed hood.',
      images: ['https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'OW-PMP-M-NVY', size: 'M', color: 'Navy', hex: '#000080', stock: 8 }],
    },
    {
      name: 'Tailored Linen Blazer',
      slug: 'tailored-linen-blazer',
      cat: 'outerwear',
      price: 459000,
      sku: 'OW-TLB',
      desc: 'Unlined summer blazer crafted from pure linen with horn buttons and double back vents.',
      images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'OW-TLB-L-WHT', size: 'L', color: 'White', hex: '#FFFFFF', stock: 0 }], // Out of stock
    },
    {
      name: 'Minimalist Biker Leather Jacket',
      slug: 'minimalist-biker-leather-jacket',
      cat: 'outerwear',
      price: 1499000,
      sku: 'OW-MBL',
      desc: 'Supple nappa sheepskin leather jacket with asymmetrical YKK zippers and satin lining.',
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'OW-MBL-M-BLK', size: 'M', color: 'Black', hex: '#000000', stock: 4 }], // Low stock
    },
    {
      name: 'Water-Repellent Anorak Parka',
      slug: 'water-repellent-anorak-parka',
      cat: 'outerwear',
      price: 589000,
      sku: 'OW-WAP',
      desc: 'Lightweight tech nylon shell with adjustable drawstring hood, waist cincher, and storm pockets.',
      images: ['https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'OW-WAP-L-SGE', size: 'L', color: 'Sage', hex: '#9CAF88', stock: 11 }],
    },
    {
      name: 'Soft Fleece Cardigan Jacket',
      slug: 'soft-fleece-cardigan-jacket',
      cat: 'outerwear',
      price: 329000,
      sku: 'OW-SFC',
      desc: 'Plush sherpa fleece button-front cardigan with snap closures and nylon elbow patches.',
      images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'OW-SFC-M-CRM', size: 'M', color: 'Cream', hex: '#FFFDD0', stock: 13 }],
    },
    {
      name: 'Belted Duster Cardigan',
      slug: 'belted-duster-cardigan',
      cat: 'outerwear',
      price: 379000,
      sku: 'OW-BDC',
      desc: 'Ankle-length open front longline knit cardigan with matching tie belt.',
      images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'OW-BDC-S-GRY', size: 'S', color: 'Oatmeal', hex: '#E6D7C3', stock: 6 }],
    },
    {
      name: 'Corduroy Trucker Jacket',
      slug: 'corduroy-trucker-jacket',
      cat: 'outerwear',
      price: 429000,
      sku: 'OW-CTK',
      desc: '8-wale heavy corduroy jacket with metal shank buttons and fleece body lining.',
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'OW-CTK-M-BRN', size: 'M', color: 'Chestnut', hex: '#954535', stock: 8 }],
    },
    {
      name: 'Unstructured Summer Kimono Jacket',
      slug: 'unstructured-summer-kimono-jacket',
      cat: 'outerwear',
      price: 319000,
      sku: 'OW-USK',
      desc: 'Fluid linen-viscose blend open front jacket with wide 3/4 sleeves and flat band trim.',
      images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'OW-USK-OS-NVY', size: 'One Size', color: 'Navy', hex: '#000080', stock: 15 }],
    },

    // --- BOTTOMS (12 Products) ---
    {
      name: 'Wide Leg Tailored Trousers',
      slug: 'wide-leg-tailored-trousers',
      cat: 'bottoms',
      price: 349000,
      sku: 'BT-WLT',
      desc: 'High-waisted trousers featuring front pleats, side pockets, and a wide fluid leg silhouette.',
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
      ],
      vars: [
        { sku: 'BT-WLT-S-NVY', size: 'S', color: 'Navy', hex: '#000080', stock: 7 },
        { sku: 'BT-WLT-M-NVY', size: 'M', color: 'Navy', hex: '#000080', stock: 14 },
        { sku: 'BT-WLT-L-OLV', size: 'L', color: 'Olive', hex: '#808000', stock: 9 },
      ],
    },
    {
      name: 'Relaxed Straight Selvedge Denim',
      slug: 'relaxed-straight-selvedge-denim',
      cat: 'bottoms',
      price: 389000,
      sku: 'BT-RSS',
      desc: '13.5 oz raw Japanese selvedge cotton denim cut in a classic relaxed mid-rise straight leg.',
      images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop'],
      vars: [
        { sku: 'BT-RSS-30-IND', size: '30', color: 'Indigo', hex: '#4B0082', stock: 10 },
        { sku: 'BT-RSS-32-IND', size: '32', color: 'Indigo', hex: '#4B0082', stock: 3 }, // Low stock
      ],
    },
    {
      name: 'Pleated Midi Column Skirt',
      slug: 'pleated-midi-column-skirt',
      cat: 'bottoms',
      price: 299000,
      sku: 'BT-PMC',
      desc: 'Knife pleated midi skirt with concealed elastic waistband and silky fluid drape.',
      images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'BT-PMC-S-BLK', size: 'S', color: 'Black', hex: '#000000', stock: 12 }],
    },
    {
      name: 'Tapered Linen Drawstring Pants',
      slug: 'tapered-linen-drawstring-pants',
      cat: 'bottoms',
      price: 279000,
      sku: 'BT-TLD',
      desc: 'Casual pull-on linen trousers with elastic drawstring waistband and tapered cuff hem.',
      images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'BT-TLD-M-BEG', size: 'M', color: 'Natural Beige', hex: '#F5F5DC', stock: 18 }],
    },
    {
      name: 'Cargo Utility Wide Trousers',
      slug: 'cargo-utility-wide-trousers',
      cat: 'bottoms',
      price: 369000,
      sku: 'BT-CUW',
      desc: 'Cotton ripstop cargo pants with 3D gusseted leg pockets and adjustable drawstring ankles.',
      images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'BT-CUW-L-KHK', size: 'L', color: 'Olive Khaki', hex: '#C3B091', stock: 5 }], // Low stock
    },
    {
      name: 'High-Rise Slim Chinos',
      slug: 'high-rise-slim-chinos',
      cat: 'bottoms',
      price: 319000,
      sku: 'BT-HRS',
      desc: 'Stretch cotton twill chinos tailored with high rise waist and clean slim leg cut.',
      images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'BT-HRS-M-NVY', size: 'M', color: 'Navy', hex: '#000080', stock: 11 }],
    },
    {
      name: 'Wrap-Front Asymmetric Skirt',
      slug: 'wrap-front-asymmetric-skirt',
      cat: 'bottoms',
      price: 289000,
      sku: 'BT-WFA',
      desc: 'A-line wrap skirt featuring button waist closure and asymmetric hemline.',
      images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'BT-WFA-S-TER', size: 'S', color: 'Terracotta', hex: '#E2725B', stock: 2 }], // Low stock
    },
    {
      name: 'Fluid Satin Slip Skirt',
      slug: 'fluid-satin-slip-skirt',
      cat: 'bottoms',
      price: 269000,
      sku: 'BT-FSS',
      desc: 'Bias-cut satin midi skirt that drapes effortlessly over hips. Hidden side zipper.',
      images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'BT-FSS-M-GLD', size: 'M', color: 'Champagne', hex: '#F7E7CE', stock: 14 }],
    },
    {
      name: 'Tailored Bermuda Shorts',
      slug: 'tailored-bermuda-shorts',
      cat: 'bottoms',
      price: 229000,
      sku: 'BT-TBS',
      desc: 'Knee-length Bermuda shorts with front pleats and tailored waist hooks.',
      images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'BT-TBS-L-BLK', size: 'L', color: 'Black', hex: '#000000', stock: 8 }],
    },
    {
      name: 'Elasticated Crop Joggers',
      slug: 'elasticated-crop-joggers',
      cat: 'bottoms',
      price: 249000,
      sku: 'BT-ECJ',
      desc: 'French terry cotton lounge pants with rib cuffs and side slash pockets.',
      images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'BT-ECJ-M-GRY', size: 'M', color: 'Grey Melange', hex: '#BEBEBE', stock: 0 }], // Out of stock
    },
    {
      name: 'Washed Denim Maxi Skirt',
      slug: 'washed-denim-maxi-skirt',
      cat: 'bottoms',
      price: 359000,
      sku: 'BT-WDM',
      desc: 'Vintage washed rigid denim maxi skirt with center front leg slit and 5-pocket styling.',
      images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'BT-WDM-S-BLU', size: 'S', color: 'Medium Wash', hex: '#4682B4', stock: 9 }],
    },
    {
      name: 'Drawstring Linen Shorts',
      slug: 'drawstring-linen-shorts',
      cat: 'bottoms',
      price: 199000,
      sku: 'BT-DLS',
      desc: 'Resort-ready 100% linen shorts with elastic waist and back welt pocket.',
      images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'BT-DLS-M-WHT', size: 'M', color: 'White', hex: '#FFFFFF', stock: 16 }],
    },

    // --- ACCESSORIES (12 Products) ---
    {
      name: 'Minimalist Leather Tote Bag',
      slug: 'minimalist-leather-tote-bag',
      cat: 'accessories',
      price: 399000,
      sku: 'AC-LTB',
      desc: 'Handcrafted genuine leather tote with an interior zip pocket and magnetic closure. Holds up to a 15-inch laptop.',
      images: [
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
      ],
      vars: [
        { sku: 'AC-LTB-OS-BRN', size: 'One Size', color: 'Brown', hex: '#8B4513', stock: 18 },
        { sku: 'AC-LTB-OS-BLK', size: 'One Size', color: 'Black', hex: '#000000', stock: 25 },
      ],
    },
    {
      name: 'Structured Crossbody Pouch',
      slug: 'structured-crossbody-pouch',
      cat: 'accessories',
      price: 259000,
      sku: 'AC-SCP',
      desc: 'Compact boxy shoulder pouch with adjustable leather strap and custom brass hardware.',
      images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'AC-SCP-OS-TAN', size: 'One Size', color: 'Tan', hex: '#D2B48C', stock: 6 }],
    },
    {
      name: 'Chunky Chain Pendant Necklace',
      slug: 'chunky-chain-pendant-necklace',
      cat: 'accessories',
      price: 179000,
      sku: 'AC-CCP',
      desc: '18k gold-plated recycled brass paperclip chain with coin pendant medallion.',
      images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'AC-CCP-OS-GLD', size: 'One Size', color: 'Gold', hex: '#FFD700', stock: 15 }],
    },
    {
      name: 'Woven Straw Sun Hat',
      slug: 'woven-straw-sun-hat',
      cat: 'accessories',
      price: 189000,
      sku: 'AC-WSH',
      desc: 'Wide brim raffia straw hat with black grosgrain ribbon tie.',
      images: ['https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'AC-WSH-OS-NAT', size: 'One Size', color: 'Natural', hex: '#EEDC82', stock: 4 }], // Low stock
    },
    {
      name: 'Full-Grain Leather Belt',
      slug: 'full-grain-leather-belt',
      cat: 'accessories',
      price: 149000,
      sku: 'AC-FGL',
      desc: '30mm vegetable-tanned leather waist belt with brushed nickel buckle.',
      images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'AC-FGL-M-BLK', size: 'M', color: 'Black', hex: '#000000', stock: 20 }],
    },
    {
      name: 'Oversized Square Sunglasses',
      slug: 'oversized-square-sunglasses',
      cat: 'accessories',
      price: 219000,
      sku: 'AC-OSS',
      desc: 'Handcrafted acetate frames with UV400 polarized dark tinted lenses.',
      images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'AC-OSS-OS-TRT', size: 'One Size', color: 'Tortoise', hex: '#800000', stock: 8 }],
    },
    {
      name: 'Soft Cashmere Scarf',
      slug: 'soft-cashmere-scarf',
      cat: 'accessories',
      price: 299000,
      sku: 'AC-SCS',
      desc: 'Lightweight woven cashmere scarf with soft fringed edge detail.',
      images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'AC-SCS-OS-GRY', size: 'One Size', color: 'Camel', hex: '#C19A6B', stock: 3 }], // Low stock
    },
    {
      name: 'Canvas Weekend Duffle Bag',
      slug: 'canvas-weekend-duffle-bag',
      cat: 'accessories',
      price: 499000,
      sku: 'AC-CWD',
      desc: 'Heavy 18oz cotton canvas carry-on travel bag with leather trim handles.',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'AC-CWD-OS-OLV', size: 'One Size', color: 'Olive', hex: '#556B2F', stock: 7 }],
    },
    {
      name: 'Minimal Gold Hoop Earrings',
      slug: 'minimal-gold-hoop-earrings',
      cat: 'accessories',
      price: 129000,
      sku: 'AC-MGH',
      desc: 'Hypoallergenic sterling silver coated in 18k thick gold vermeil. Lightweight everyday hoops.',
      images: ['https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'AC-MGH-OS-GLD', size: 'One Size', color: 'Gold', hex: '#FFD700', stock: 12 }],
    },
    {
      name: 'Leather Cardholder Wallet',
      slug: 'leather-cardholder-wallet',
      cat: 'accessories',
      price: 169000,
      sku: 'AC-LCW',
      desc: 'Slim 4-card pocket wallet with center note compartment in pebble grain leather.',
      images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'AC-LCW-OS-BLK', size: 'One Size', color: 'Black', hex: '#000000', stock: 0 }], // Out of stock
    },
    {
      name: 'Silk Patterned Head Scarf',
      slug: 'silk-patterned-head-scarf',
      cat: 'accessories',
      price: 159000,
      sku: 'AC-SPH',
      desc: 'Square 100% mulberry silk neckerchief with hand-rolled edges.',
      images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'AC-SPH-OS-PRT', size: 'One Size', color: 'Terracotta Print', hex: '#E2725B', stock: 10 }],
    },
    {
      name: 'Braided Leather Sandals',
      slug: 'braided-leather-sandals',
      cat: 'accessories',
      price: 329000,
      sku: 'AC-BLS',
      desc: 'Handcrafted leather slide sandals with woven front strap and cushioned footbed.',
      images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'],
      vars: [{ sku: 'AC-BLS-38-TAN', size: '38', color: 'Tan Leather', hex: '#D2B48C', stock: 5 }], // Low stock
    },
  ];

  console.log(`Seeding ${sampleProducts.length} products with variants and audit history...`);

  for (const p of sampleProducts) {
    const catId = categoryMap[p.cat];
    if (!catId) continue;

    const createdProduct = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        categoryId: catId,
        basePrice: p.price,
        status: 'published',
        skuPrefix: p.sku,
        description: p.desc,
      },
      create: {
        name: p.name,
        slug: p.slug,
        categoryId: catId,
        basePrice: p.price,
        status: 'published',
        skuPrefix: p.sku,
        description: p.desc,
      },
    });

    // Replace product images
    await prisma.productImage.deleteMany({ where: { productId: createdProduct.id } });
    for (let idx = 0; idx < p.images.length; idx++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: p.images[idx],
          altText: `${p.name} Image ${idx + 1}`,
          isPrimary: idx === 0,
          displayOrder: idx,
        },
      });
    }

    // Upsert variants and record inventory adjustment logs
    for (const v of p.vars) {
      const variant = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          stockQuantity: v.stock,
        },
        create: {
          productId: createdProduct.id,
          sku: v.sku,
          size: v.size,
          color: v.color,
          colorHex: v.hex,
          stockQuantity: v.stock,
          lowStockThreshold: 5,
        },
      });

      // Record audit adjustment log row if none exists for variant
      const existingAudit = await prisma.inventoryAdjustment.findFirst({
        where: { variantId: variant.id },
      });
      if (!existingAudit && v.stock > 0) {
        await prisma.inventoryAdjustment.create({
          data: {
            variantId: variant.id,
            quantityDelta: v.stock,
            reason: 'initial restock on dataset seed',
          },
        });
      }
    }
  }

  // 8. Default Store Settings
  const settingsData = [
    {
      key: 'store_info',
      value: {
        name: 'Fashion Store',
        tagline: 'Modern Mobile-First Fashion',
        phone: '+6281234567890',
        email: 'info@fashionstore.com',
        address: 'Jl. Sudirman No. 45, Jakarta',
      },
    },
    {
      key: 'store_whatsapp_number',
      value: '6281234567890',
    },
  ];

  for (const s of settingsData) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log(`Successfully seeded ${sampleProducts.length} fashion products across 4 categories!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
