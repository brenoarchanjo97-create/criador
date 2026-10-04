# Como publicar um carrossel no @despertarnews

These are the steps the test used on 2026-10-02. The test published https://www.instagram.com/p/Dd_sSgwoDs5/

## Requirements
- The session must run in the cloud environment **Noticias** (env_01NHa9LyAFXccv3Vb9V1z3jb, the project default).
  - In that environment the proxy injects `Authorization: Bearer <token>` into every request to `graph.instagram.com`.
  - There is no token in env vars or in files. Never ask for the token in the chat, and never write it to a file.
- Auto mode blocks `publicar.py` unless the session loaded the rule `allow Bash(python3 publicar.py:*)`.
  - That rule lives in `.claude/settings.json` on the `master` branch of `brenoarchanjo97-create/criador`.
  - The session must start with that repo attached, and only sessions created after the commit have the rule.
  - Run the command exactly as `python3 publicar.py ...`, from inside the folder. Another form (`python3 /path/publicar.py`, `cd ... &&`) may not match the rule.
- Pillow: `python3 -m pip install -q pillow`. It needs the environment's package-manager list, which is turned on.

## 1. Generate the images
```
cd /mnt/project-files/instagram
python3 gerar_card.py fila/<arquivo>.json /tmp/car/<slug>
```
- Pass a prefix without `.jpg` and the script writes `<slug>_1.jpg` to `<slug>_4.jpg`: the news card plus the 3 "ENTENDA" slides.
- The JSON has the same fields as `exemplo.json`: categoria, data, titulo, resumo, destaque (optional), fonte, perfil="@despertarnews", and explicacao (a list of 3 items, each `{titulo, texto:[parágrafos]}`).
- The masthead defaults to "NOTÍCIAS A CADA 30 MINUTOS".

## 2. Upload the images to the `cards` branch of criador
- `cards` is an orphan branch that holds only images. Never touch `master`, because that's the Imóveis Archanjo website.
- The repo must be attached to the session with push access (add_repo owner=brenoarchanjo97-create repo=criador access=push). The Claude GitHub App is installed.

```
git clone --depth 1 --branch cards https://github.com/brenoarchanjo97-create/criador /tmp/cards
mkdir -p /tmp/cards/AAAA-MM-DD
cp /tmp/car/<slug>_*.jpg /tmp/cards/AAAA-MM-DD/
cd /tmp/cards && git add -A && git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "Cards: <slug>" && git push -q origin cards
```
- Use a **new file name for every post**, for example `AAAA-MM-DD/HHhMM-<slug>_N.jpg`.
  - raw.githubusercontent caches files for about 5 minutes.
  - Overwriting a name can make Instagram fetch the old image.

## 3. Public URL
```
https://raw.githubusercontent.com/brenoarchanjo97-create/criador/cards/AAAA-MM-DD/<arquivo>.jpg
```
- Check every URL before publishing: `curl -s -o /dev/null -w "%{http_code} %{content_type}\n" <url>` must return `200 image/jpeg`.

## 4. Publish
```
cd /mnt/project-files/instagram
python3 publicar.py <legenda.txt> <url1> <url2> <url3> <url4>
```
- On success it prints `{"post_id": ..., "permalink": ...}`.
- The steps it runs are: create one container per image (is_carousel_item), then the CAROUSEL container with the caption, wait for FINISHED, then media_publish.
- **Never repeat** the command when it fails during `media_publish`. First check whether the post already went out with `GET https://graph.instagram.com/v21.0/me/media?fields=id,permalink,timestamp`.

## Limits and care
- The Instagram API allows about 100 posts per 24h. One post per bulletin uses at most 48 a day.
- The caption has a 2,200-character limit and at most 30 hashtags.
- Every fact on the card and in the caption must come from the bulletin's linked source.
