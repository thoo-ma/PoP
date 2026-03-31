import { serve } from "std/http/server"
import { handleUseNft } from "./handler.ts"

serve(handleUseNft)
