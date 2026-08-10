-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "size" SET DATA TYPE TEXT USING "size"::TEXT;

-- DataMigration: remap individual EU sizes to the 2-size-scale bucket
-- label that was always the physical mold (e.g. 42 -> '41/42').
UPDATE "OrderItem" SET "size" = CASE "size"
  WHEN '35' THEN '35/36'
  WHEN '36' THEN '35/36'
  WHEN '37' THEN '37/38'
  WHEN '38' THEN '37/38'
  WHEN '39' THEN '39/40'
  WHEN '40' THEN '39/40'
  WHEN '41' THEN '41/42'
  WHEN '42' THEN '41/42'
  WHEN '43' THEN '43/44'
  WHEN '44' THEN '43/44'
  WHEN '45' THEN '45/45'
  WHEN '46' THEN '45/45'
  ELSE "size"
END;
