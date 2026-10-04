"""Gera um card 1080x1350 (retrato 4:5 do Instagram) com cara de portal de notícia, em branco e verde esmeralda."""
import sys, json, re
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1350
S = 3  # desenha em resolução triplicada e reduz no fim: letras mais nítidas
VERDE, VERDE_ESC, BRANCO, TEXTO, CINZA = "#006B52", "#004D3A", "#FFFFFF", "#111111", "#3B4440"
D, L = "/usr/share/fonts/truetype/dejavu/", "/usr/share/fonts/truetype/liberation/"
sans_b = lambda s: ImageFont.truetype(D + "DejaVuSans-Bold.ttf", s * S)
sans = lambda s: ImageFont.truetype(D + "DejaVuSans.ttf", s * S)
serif_b = lambda s: ImageFont.truetype(L + "LiberationSerif-Bold.ttf", s * S)
serif = lambda s: ImageFont.truetype(L + "LiberationSerif-Regular.ttf", s * S)

class Desenho:
    """ImageDraw em coordenadas de 1080 px sobre a tela S vezes maior."""
    def __init__(self, img): self.d = ImageDraw.Draw(img)
    def text(self, xy, t, font, fill): self.d.text((xy[0] * S, xy[1] * S), t, font=font, fill=fill)
    def rectangle(self, b, fill): self.d.rectangle([v * S for v in b], fill=fill)
    def line(self, b, fill, width): self.d.line([v * S for v in b], fill=fill, width=width * S)
    def textlength(self, t, font): return self.d.textlength(t, font=font) / S

def nova(h): return Image.new("RGB", (W * S, h * S), BRANCO)

def salvar(img, out):
    img.resize((W, H), Image.LANCZOS).save(out, quality=100, subsampling=0)

def quebrar(d, texto, fonte, largura):
    """Quebra por largura em pixels, sem separar "R$ 77" nem "1º turno"."""
    texto = re.sub(r"(R\$|\dº|\dª) ", "\\1\u00a0", texto)
    linhas, atual = [], ""
    for p in texto.split(" "):
        teste = (atual + " " + p).strip()
        if atual and d.textlength(teste, font=fonte) > largura:
            linhas.append(atual); atual = p
        else:
            atual = teste
    return linhas + [atual]

def moldura(n):
    """Cabeçalho e rodapé do "jornal"; devolve a imagem e o seu ImageDraw."""
    img = nova(H)
    d = Desenho(img)
    d.rectangle([0, 0, W, 110], fill=VERDE)
    d.text((60, 28), n.get("marca", "NOTÍCIAS DO DIA A DIA"), font=serif_b(52), fill=BRANCO)
    d.rectangle([0, 110, W, 118], fill=VERDE_ESC)
    d.rectangle([0, H - 100, W, H], fill=VERDE_ESC)
    d.text((60, H - 66), "FONTE: " + n["fonte"].upper(), font=sans_b(28), fill=BRANCO)
    p = n["perfil"]
    d.text((W - 60 - d.textlength(p, font=sans_b(28)), H - 66), p, font=sans_b(28), fill=BRANCO)
    return img, d

def centralizar(img, miolo, altura):
    """Cola o miolo (já desenhado a partir de y=0) centralizado entre o cabeçalho e o rodapé."""
    topo, base = 118, H - 100
    y0 = topo + max(40, (base - topo - altura) // 2)
    img.paste(miolo.crop((0, 0, W * S, altura * S)), (0, y0 * S))

def card(n, out):
    img, _ = moldura(n)
    m = nova(H * 2)
    d = Desenho(m)
    # linha de data
    d.text((60, 0), n["data"].upper(), font=sans_b(22), fill=CINZA)
    d.line([60, 40, W - 60, 40], fill="#B8C4BE", width=2)
    # chapéu (editoria)
    tag = n["categoria"].upper()
    tw = d.textlength(tag, font=sans_b(30))
    d.rectangle([60, 65, 60 + tw + 40, 115], fill=VERDE)
    d.text((80, 73), tag, font=sans_b(30), fill=BRANCO)
    # manchete
    y = 140
    for line in quebrar(d, n["titulo"], serif_b(70), W - 120):
        d.text((60, y), line, font=serif_b(70), fill=TEXTO); y += 80
    y += 20
    # linha fina
    for line in quebrar(d, n["resumo"], serif(36), W - 120):
        d.text((60, y), line, font=serif(36), fill="#222222"); y += 48
    # destaque numérico opcional
    if n.get("destaque"):
        y += 30
        d.rectangle([60, y, 70, y + 100], fill=VERDE)
        d.text((95, y - 4), n["destaque"]["valor"], font=sans_b(60), fill=VERDE)
        d.text((95, y + 68), n["destaque"]["rotulo"], font=sans(26), fill=CINZA)
        y += 110
    centralizar(img, m, y)
    salvar(img, out)

def slide_explicacao(n, i, total, item, out, tag="ENTENDA"):
    """Slide de explicação do carrossel (2/4, 3/4, 4/4); com tag="PARA REFLETIR" vira o slide final de comentário."""
    img, _ = moldura(n)
    m = nova(H * 2)
    d = Desenho(m)
    tw = d.textlength(tag, font=sans_b(30))
    d.rectangle([60, 0, 60 + tw + 40, 50], fill=VERDE)
    d.text((80, 8), tag, font=sans_b(30), fill=BRANCO)
    cont = f"{i}/{total}"
    d.text((W - 60 - d.textlength(cont, font=sans_b(34)), 6), cont, font=sans_b(34), fill=VERDE)
    y = 90
    for line in quebrar(d, item["titulo"], serif_b(60), W - 120):
        d.text((60, y), line, font=serif_b(60), fill=TEXTO); y += 70
    y += 15
    d.rectangle([60, y, 180, y + 6], fill=VERDE); y += 40
    for par in item["texto"]:
        for line in quebrar(d, par, serif(38), W - 120):
            d.text((60, y), line, font=serif(38), fill="#222222"); y += 50
        y += 22
    if item.get("fonte"):
        d.text((60, y + 10), item["fonte"], font=sans_b(26), fill=VERDE); y += 50
    centralizar(img, m, y)
    salvar(img, out)

def carrossel(n, prefixo):
    """Gera o card da notícia e os slides de explicação; devolve a lista de arquivos."""
    arqs = [f"{prefixo}_1.jpg"]
    card(n, arqs[0])
    exp = n.get("explicacao", [])
    fe = n.get("comentario")
    total = len(exp) + 1 + (1 if fe else 0)
    for k, item in enumerate(exp, start=2):
        arqs.append(f"{prefixo}_{k}.jpg")
        slide_explicacao(n, k, total, item, arqs[-1])
    if fe:
        arqs.append(f"{prefixo}_{total}.jpg")
        slide_explicacao(n, total, total, fe, arqs[-1], tag="PARA REFLETIR")
    return arqs

if __name__ == "__main__":
    n = json.load(open(sys.argv[1]))
    if sys.argv[2].endswith(".jpg"):
        card(n, sys.argv[2])
    else:
        print("\n".join(carrossel(n, sys.argv[2])))
