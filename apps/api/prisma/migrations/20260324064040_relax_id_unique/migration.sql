-- DropIndex
DROP INDEX "ItemIdentifier_value_key";

-- CreateIndex
CREATE INDEX "ItemIdentifier_value_idx" ON "ItemIdentifier"("value");
