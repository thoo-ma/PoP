import { serve } from "std/http/server"
import { handleOpenMysteryBox } from "./handler.ts"

serve(handleOpenMysteryBox)
