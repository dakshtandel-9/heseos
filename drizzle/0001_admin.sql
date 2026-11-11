CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS products (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, sku TEXT NOT NULL UNIQUE, category TEXT NOT NULL,
 description TEXT NOT NULL DEFAULT '', image TEXT NOT NULL DEFAULT '', price INTEGER, mrp INTEGER,
 stock INTEGER CHECK(stock IS NULL OR stock >= 0), status TEXT NOT NULL CHECK(status IN ('active','draft','archived')),
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS orders (
 id TEXT PRIMARY KEY, request_key TEXT UNIQUE NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
 address TEXT NOT NULL, total INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
 payment TEXT NOT NULL DEFAULT 'unpaid', notes TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS order_items (
 id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), product_id TEXT NOT NULL REFERENCES products(id),
 name TEXT NOT NULL, price INTEGER NOT NULL, qty INTEGER NOT NULL CHECK(qty > 0)
);
CREATE TABLE IF NOT EXISTS submissions (
 id TEXT PRIMARY KEY, type TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
 details TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', notes TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS activity (id TEXT PRIMARY KEY, message TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS orders_date ON orders(created_at);
CREATE INDEX IF NOT EXISTS submissions_date ON submissions(created_at);
CREATE TRIGGER IF NOT EXISTS reserve_stock BEFORE INSERT ON order_items BEGIN
 SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM products WHERE id=NEW.product_id AND status='active' AND price=NEW.price AND (stock IS NULL OR stock>=NEW.qty)) THEN RAISE(ABORT,'Product unavailable or insufficient stock') END;
 UPDATE products SET stock=stock-NEW.qty WHERE id=NEW.product_id AND stock IS NOT NULL;
END;
CREATE TRIGGER IF NOT EXISTS restore_stock AFTER UPDATE OF status ON orders WHEN NEW.status='cancelled' AND OLD.status!='cancelled' BEGIN
 UPDATE products SET stock=stock+(SELECT SUM(qty) FROM order_items WHERE order_id=NEW.id AND product_id=products.id) WHERE stock IS NOT NULL AND id IN (SELECT product_id FROM order_items WHERE order_id=NEW.id);
END;
