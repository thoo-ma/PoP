import { serve } from "std/http/server"
import { handleRollLoot } from "./handler.ts"

serve(handleRollLoot)
