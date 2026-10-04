"""Publica um carrossel no Instagram do @despertarnews.

Uso: python3 publicar.py legenda.txt URL1 URL2 [URL3 ...]
As URLs precisam ser públicas (JPEG). O token é injetado pelo proxy do ambiente
"Noticias" no cabeçalho Authorization para graph.instagram.com.
"""
import sys, json, time, urllib.request, urllib.parse

API = "https://graph.instagram.com/v21.0"

def chamar(metodo, caminho, dados=None):
    corpo = urllib.parse.urlencode(dados).encode() if dados else None
    req = urllib.request.Request(f"{API}/{caminho}", data=corpo, method=metodo)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"Erro {e.code} em {caminho}: {e.read().decode()}")

def esperar(container):
    for _ in range(30):
        st = chamar("GET", f"{container}?fields=status_code").get("status_code")
        if st == "FINISHED":
            return
        if st in ("ERROR", "EXPIRED"):
            sys.exit(f"Container {container} falhou: {st}")
        time.sleep(5)
    sys.exit(f"Container {container} não ficou pronto a tempo")

def publicar(legenda, urls):
    uid = chamar("GET", "me?fields=user_id")["user_id"]
    filhos = []
    for u in urls:
        c = chamar("POST", f"{uid}/media", {"image_url": u, "is_carousel_item": "true"})["id"]
        esperar(c); filhos.append(c)
    car = chamar("POST", f"{uid}/media", {"media_type": "CAROUSEL", "children": ",".join(filhos), "caption": legenda})["id"]
    esperar(car)
    post = chamar("POST", f"{uid}/media_publish", {"creation_id": car})["id"]
    link = chamar("GET", f"{post}?fields=permalink").get("permalink")
    print(json.dumps({"post_id": post, "permalink": link}))

if __name__ == "__main__":
    publicar(open(sys.argv[1], encoding="utf-8").read().strip(), sys.argv[2:])
