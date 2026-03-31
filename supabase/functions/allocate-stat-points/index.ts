import { serve } from "std/http/server"
import { handleAllocateStatPoints } from "./handler.ts"

serve(handleAllocateStatPoints)
