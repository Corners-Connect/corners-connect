# ComfyUI flow

The saved flow that makes a Corners photograph from the template in `../master-prompt.md`.
Owner: Federico. **Status: first version, run once on Comfy Cloud (18 Oct 2026).**

## Open it
1. Open Comfy Cloud (comfy.org/cloud) and sign in.
2. Menu → File → Open, and choose `corners.json`. (Or drag the file onto the canvas.)
3. Paste the filled-in prompt into the `prompt` box and press Run.

To repeat one exact image, drag its PNG onto the canvas: ComfyUI stores the flow and the seed inside
the file.

## What it does, node by node
Text-to-image with Z-Image-Turbo. The flow is the "Text to Image (Z-Image-Turbo)" template from
ComfyUI, with our prompt and a save name.

| Node | Setting |
|---|---|
| UNETLoader | `z_image_turbo_bf16.safetensors` (the image model) |
| CLIPLoader | `qwen_3_4b.safetensors`, type `lumina2` (reads the prompt) |
| VAELoader | `ae.safetensors` (turns the result into pixels) |
| CLIPTextEncode | the prompt |
| ConditioningZeroOut | feeds the "negative" input. There is no negative prompt in this flow |
| EmptySD3LatentImage | 1024 × 1024, one image |
| ModelSamplingAuraFlow | shift 3 |
| KSampler | 8 steps, cfg 1, `res_multistep`, `simple`, seed set to randomize |
| VAEDecode → SaveImage | file prefix `z-image-turbo` |

## What this means for the prompt
Because cfg is 1 and the negative input is zeroed out, **"do not include" lines do nothing** in this
flow. Say what is visible instead. This is why the template ends with "Only people and architecture
are visible…" (see "Mistakes the first tests showed" in the master prompt).

## First test
- Image: `../../03 - Deliverables/mp1/images/comfy-test-01.png`, made with this flow. Awaiting the
  second-person review (Jenna). Not approved yet.
- Prompt: the template with Scene "two students looking at a paper map and a phone on a riverside
  walkway", Place "Bilbao, a walkway along the river with the Zubizuri white pedestrian bridge
  visible in the distance". Full text is saved inside `corners.json`.
- Seed: randomized on every run, so the number shown after a run may belong to the next run. The PNG
  holds the real one.

## Known limits
- The two students look about 17–19, not 22, even when the prompt says "about 22 years old, adults".
- The bridge is the model's idea of a white arch bridge in Bilbao, not an exact Zubizuri.
- Free plan on Comfy Cloud: 5 runs. We used 4 of them to find the prompt.

## Tool and model licence
Name these in the playbook before an image is approved. Search results say Z-Image-Turbo is
Apache 2.0, but that has **not** been checked on the model page yet. Still to check, on the pages
linked in the first note of the flow (`Hugging Face: Comfy-Org/z_image_turbo`): the licence of
Z-Image-Turbo, of Qwen3-4B and of the `ae` VAE, and what Comfy Cloud's terms say about using the
images.
