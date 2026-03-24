# Deployment Guide

## Post-Code Steps

### 1. Generate API Key
```bash
openssl rand -hex 32
```
**Save this key!** You'll need it for both Cloud Run and Supabase Edge Function.

---

### 2. Deploy Cloud Run

From the `google-cloud-run/` directory:

```bash
cd google-cloud-run

# Deploy (replace YOUR_API_KEY with the key from step 1)
gcloud run deploy yamnet-detector \
  --source . \
  --region us-central1 \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 100 \
  --timeout 60s \
  --allow-unauthenticated \
  --set-env-vars MODEL_VERSION=yamnet-v1,API_SECRET_KEY=YOUR_API_KEY
```

**Important:** Copy the service URL from the output. It will look like:
`https://yamnet-detector-xxxxx-uc.a.run.app`

---

### 3. Push Database Migration

From the project root:

```bash
cd /home/youngbenjaminhorne/work/pop
supabase db push
```

This creates the `flush_detections` table.

---

### 4. Deploy Supabase Edge Functions

**Toilet flush detection** (requires Cloud Run):
```bash
supabase functions deploy detect-toilet-flush \
  --project-ref mtnluwkvhkwwxvxdtkgs \
  --set CLOUD_RUN_URL=https://yamnet-detector-xxxxx-uc.a.run.app \
  --set CLOUD_RUN_API_KEY=YOUR_API_KEY
```

**NFT breeding** (no extra secrets needed — uses auto-injected `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`):
```bash
supabase functions deploy breed-nfts --project-ref mtnluwkvhkwwxvxdtkgs
```

---

### 5. Install Dependencies

From the project root (pnpm workspaces):

```bash
pnpm install
```

This installs dependencies for all workspace packages (`frontend/`, `dashboard/`, `shared/`).

---

### 6. Test the App

```bash
cd frontend && pnpm start
```

Navigate through the screens:
1. Home
2. Proof of Immobility
3. Proof of Time
4. **Proof of Poop** 💩 (NEW - record and detect toilet flush)
5. **Detection History** (NEW - view your detection records)

---

## Configuration Management

### Adjust Rate Limit

To change the daily detection limit from 10 to another value:

1. Go to Supabase Dashboard > SQL Editor
2. Run:
```sql
UPDATE game_config 
SET value = value || '{"detections_per_day": 20}'::jsonb
WHERE key = 'cloud_run';
```

No code deployment needed - the Edge Function reads this dynamically!

---

## Troubleshooting

### Cloud Run deployment fails
- Check billing is enabled: `gcloud beta billing accounts list`
- Check project ID: `gcloud config get-value project`

### Edge Function returns 401
- Verify you're logged in the app (uses JWT from Supabase auth)
- Check Edge Function logs:
  - `supabase functions logs detect-toilet-flush`
  - `supabase functions logs breed-nfts`

### Audio recording fails
- iOS: Check Info.plist has microphone permission (Expo should handle this)
- Android: Check RECORD_AUDIO permission in manifest (Expo should handle this)

### Rate limit not working
- Check database migration ran: `supabase db diff`
- Check game_config table has a `cloud_run` row in Supabase Dashboard > Table Editor

---

## Cost Monitoring

### Google Cloud Run
- Dashboard: https://console.cloud.google.com/run
- With min instances = 1: ~$15-25/month
- Monitor: Click service → Metrics tab

### Supabase
- Dashboard: https://supabase.com/dashboard/project/mtnluwkvhkwwxvxdtkgs
- Free tier: Up to 500MB database, 50K monthly active users
- Upgrade to Pro ($25/month) when you exceed limits

---

## Testing Checklist

- [ ] Cloud Run `/health` endpoint returns 200
- [ ] Database tables created (check Supabase Dashboard)
- [ ] Edge Function deployed (check Functions tab in Supabase)
- [ ] Can record audio in app
- [ ] Can analyze audio (shows detection result)
- [ ] Rate limit works (try 11 detections in one day)
- [ ] Detection History shows past recordings
- [ ] Pull to refresh works in History screen

---

## Next Steps

Once everything works:
1. Test with real toilet flush sounds
2. Adjust thresholds if needed (easy=0.3, normal=0.5, strict=0.7)
3. Monitor Cloud Run costs after a week
4. Consider adding more screens or features

Enjoy your Proof of Poop app! 💩🚀
