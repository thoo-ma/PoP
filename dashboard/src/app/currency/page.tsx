'use client'

import { useGameConfigStore } from '@/store/gameConfigStore'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RewardTab, RepairTab, BreedTab } from '@/components/currency'

export default function CurrencyPanel() {
  const clearDraftForKey = useGameConfigStore((s) => s.clearDraftForKey)
  const hasDraft = useGameConfigStore((s) => s.drafts.currency !== undefined)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Currency ($POOP)</h2>
        {hasDraft && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearDraftForKey('currency')}
            className="h-7 px-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
          >
            Reset
          </Button>
        )}
      </div>

      <Tabs defaultValue="reward" className="w-full">
        <TabsList className="bg-neutral-900 border border-neutral-800">
          <TabsTrigger value="reward" className="data-[state=active]:bg-neutral-800 text-xs">
            Use Reward
          </TabsTrigger>
          <TabsTrigger value="repair" className="data-[state=active]:bg-neutral-800 text-xs">
            Repair Cost
          </TabsTrigger>
          <TabsTrigger value="breed" className="data-[state=active]:bg-neutral-800 text-xs">
            Breed Cost
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reward">
          <RewardTab />
        </TabsContent>
        <TabsContent value="repair">
          <RepairTab />
        </TabsContent>
        <TabsContent value="breed">
          <BreedTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
