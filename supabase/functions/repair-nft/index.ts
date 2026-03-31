import { serve } from "std/http/server"
import { handleRepairNft } from "./handler.ts"

serve(handleRepairNft)
