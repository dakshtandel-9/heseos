-- Keep optimistic edit tokens current when checkout or a cancellation changes stock.
CREATE TRIGGER IF NOT EXISTS stock_change_timestamp AFTER UPDATE OF stock ON products
WHEN OLD.stock IS NOT NEW.stock
BEGIN
 UPDATE products SET updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=NEW.id;
END;
