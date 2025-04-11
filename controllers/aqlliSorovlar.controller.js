const sequelize = require("../config/db");

// 1. Berilgan vaqt oralig’ida ijaraga berilgan mahsulotlar ro’yxati

const getRentedProductsByDate = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    const results = await sequelize.query(
      `
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        c.start_date,
        c.end_date
      FROM "Contracts" c
      JOIN "Products" p ON c."ProductId" = p.id
      WHERE c.start_date >= :start_date AND c.end_date <= :end_date;
      `,
      {
        replacements: { start_date, end_date },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Vaqt oralig’ida mahsulotni yaroqsiz qilgan clientlar
const getDamagedProductsClients = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    const results = await sequelize.query(
      `
     SELECT 
  cl.id AS client_id,
  cl.first_name,
  cl.last_name,
  s.name AS status_name
FROM "Contracts" c
JOIN "Clients" cl ON c."ClientId" = cl.id
JOIN "Status" s ON c."StatusId" = s.id
WHERE s.name = 'unusableByClient'
  AND c.start_date >=  :start_date AND c.end_date <= :end_date
      `,
      {
        replacements: { start_date, end_date },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Vaqt oralig’ida buyurtmani bekor qilgan clientlar
const getCancelledContractsClients = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    const results = await sequelize.query(
      `
      SELECT 
        cl.id AS clientId,
        cl.first_name,
        cl.last_name,
        s.name AS status_name
      FROM "Contracts" c
      JOIN "Clients" cl ON c."ClientId" = cl.id
      JOIN "Status" s ON c."StatusId" = s.id
      WHERE s.name = 'Cancelled'
        AND c.start_date >= :start_date AND c.end_date <= :end_date
      `,
      {
        replacements: { start_date, end_date },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Kategoriyadagi mahsulotlarni eng ko’p ijaraga bergan ownerlar
const getTopOwnersCategory = async (req, res) => {
  try {
    const categoryid = req.params.id;

    const results = await sequelize.query(
      `
      SELECT 
        o.id AS ownerId,
        o.full_name AS owner_name,
        COUNT(*) AS rental_count
      FROM "Contracts" c
      JOIN "Products" p ON c."ProductId" = p.id
      JOIN "Owners" o ON p."OwnerId" = o.id
      WHERE p."CategoryId" = :categoryid
      GROUP BY o.id, o.full_name
      ORDER BY rental_count DESC
      `,
      {
        replacements: { categoryid },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Client ma’lumotlariga asoslanib barcha paymentlar (kategoriya, mahsulot, owner bilan)
const getClientPayments = async (req, res) => {
  try {
    const { first_name, phone_number } = req.body;

    const results = await sequelize.query(
      `
      SELECT 
        cat.name AS category_name,
        p.name AS product_name,
        o.name AS owner_name,
        pay.amount,
        pay.date,
      FROM "Payments" pay
      JOIN "Contracts" c ON pay."ContractId" = c.id
      JOIN "Products" p ON c."ProductId" = p.id
      JOIN "Categories" cat ON p."CategoryId" = cat.id
      JOIN "Owners" o ON p."OwnerId" = o.id
      JOIN "Clients" cl ON c."ClientId" = cl.id
      WHERE cl.first_name = :first_name AND cl.phone_number = :phone_number
      `,
      {
        replacements: { first_name, phone_number },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getRentedProductsByDate,
  getDamagedProductsClients,
  getCancelledContractsClients,
  getTopOwnersCategory,
  getClientPayments,
};
