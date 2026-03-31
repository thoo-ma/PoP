import { serve } from "std/http/server"
import { handleHoldLootRoll } from "./handler.ts"

serve(handleHoldLootRoll)
