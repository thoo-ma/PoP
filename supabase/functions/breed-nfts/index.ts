import { serve } from "std/http/server"
import { handleBreedNfts } from "./handler.ts"

serve(handleBreedNfts)
