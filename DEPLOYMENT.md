# Google Cloud Run Deployment & Custom Domain Guide
## Deltron Zero // 3030 24/7 AI Rap Bot (`deltron.drewratliff.com`)

This guide walks through deploying the containerized Deltron Zero application to **Google Cloud Run** with server-side API key protection and mapping the custom domain **`deltron.drewratliff.com`**.

---

## 🛠️ Step 1: Deploy to Google Cloud Run

Ensure you have the [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install) installed and authenticated (`gcloud auth login`).

### 1. Set your active Google Cloud Project:
```bash
gcloud config set project YOUR_PROJECT_ID
```

### 2. Deploy directly from source in this directory:
Run this single command from within the `/Users/drewratliff/Desktop/deltron` directory:

```bash
gcloud run deploy deltron-rap-bot \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DELTRON_API_KEY="YOUR_API_KEY_HERE",ACCESS_CODE="3030"
```

> **Note**: Replace `"YOUR_API_KEY_HERE"` with your active Gemini API key from Google AI Studio. The server will securely store this key in Cloud Run environment variables.

### 3. Verification:
When the deployment completes, Cloud Run will output a Service URL (e.g. `https://deltron-rap-bot-xyz.a.run.app`).
You can open this URL to test that the container is live and that entering access code `3030` generates verses.

---

## 🌐 Step 2: Map Custom Domain (`deltron.drewratliff.com`)

### Option A: Using Google Cloud Console (Recommended)

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **Cloud Run** -> Click **Manage Custom Domains** (or **Custom Domains** tab).
3. Click **Add Mapping**:
   - **Service to route to**: `deltron-rap-bot`
   - **Domain**: Select or enter `drewratliff.com` (or verify ownership if prompted).
   - **Subdomain**: Enter `deltron` -> Resulting FQDN: `deltron.drewratliff.com`.
4. Cloud Run will display the DNS records you need to create:
   - **Type**: `CNAME`
   - **Host / Name**: `deltron`
   - **Value / Target**: `ghs.googlehosted.com.`

---

### Option B: Using `gcloud` CLI

```bash
gcloud beta run domain-mappings create \
  --service deltron-rap-bot \
  --domain deltron.drewratliff.com \
  --region us-central1
```

---

## 🛰️ Step 3: Add DNS Record to your Domain Registrar / DNS Provider

Log into your DNS provider (e.g., Cloudflare, Namecheap, Google Domains / Squarespace, GoDaddy, AWS Route 53):

| Type | Name / Host | Target / Value | TTL | Proxy / CDN |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `deltron` | `ghs.googlehosted.com.` | Auto / 300 | DNS Only (Disable Cloudflare orange cloud if using Cloudflare initially) |

> ⏳ **SSL Certificate**: Google Cloud automatically provisions a managed SSL/TLS certificate for `deltron.drewratliff.com`. Once DNS propagates (usually 5–30 minutes), your custom domain will be fully live over HTTPS!

---

## 🔒 Security Architecture

1. **Zero Client-Side Secret Leakage**:
   - The client browser only communicates with the `/api/generate` endpoint.
   - The `DELTRON_API_KEY` remains securely inside the Google Cloud Run server environment.
2. **Access Code '3030'**:
   - The Start Broadcast modal and AI Core panel check for the access code `3030`.
   - Anyone visiting the site with code `3030` can stream 24/7 live AI neural verses without needing an API key of their own.
3. **Scale to Zero**:
   - Google Cloud Run automatically scales to 0 instances when no listeners are active, keeping hosting costs virtually zero.
