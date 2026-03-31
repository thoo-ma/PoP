import { serve } from "std/http/server"
import { handleDetectToiletFlush } from "./handler.ts"

serve(handleDetectToiletFlush)
