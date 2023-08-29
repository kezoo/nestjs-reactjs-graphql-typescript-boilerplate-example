import { getCompactedConfig } from "../utils/app.util"

export function runMigration () {
  const conf = getCompactedConfig()
  console.log(`runMigration CLI config `,  conf)
}

runMigration()
