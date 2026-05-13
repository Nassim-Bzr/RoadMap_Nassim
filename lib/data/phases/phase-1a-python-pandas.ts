import type { Week } from "../types";

export const PHASE1_PYTHON_PANDAS: Week[] = [
  {
    id: "w1",
    title: "Python Core Avancé",
    tasks: [
      {
        id: "d1",
        label: "List/Dict comprehensions",
        day: "Lun",
        description: "Une comprehension est une syntaxe ultra courte pour créer une liste, un dictionnaire ou un set en une seule ligne. C'est l'un des trucs qui rendent Python si élégant : à la place d'écrire une boucle for + append() en 4 lignes, tu fais tout en 1 ligne, plus lisible et souvent plus rapide.",
        url: "https://realpython.com/list-comprehension-python/",
        resource: "Real Python — Comprehensions",
        resources: [
          { type: "doc", title: "Python Docs — List Comprehensions", url: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions" },
          { type: "article", title: "Real Python — Guide complet", url: "https://realpython.com/list-comprehension-python/" },
          { type: "article", title: "PEP 202 — List Comprehensions", url: "https://peps.python.org/pep-0202/" },
          { type: "video", title: "Corey Schafer YouTube (12 min)", url: "https://youtu.be/3dt4OGnU5sM" },
        ],
        exercise: `🎯 OBJECTIF
Comprendre et utiliser les comprehensions pour écrire du code Python concis.

📚 RAPPEL DU CONCEPT
La syntaxe générale d'une list comprehension :
    [ <expression> for <variable> in <iterable> if <condition> ]

Exemple : [x*2 for x in [1,2,3]]  →  [2, 4, 6]

L'idée : tu remplaces une boucle for + append() par une seule ligne.

────────────────────────────────────────
✅ EXERCICE 1 — List comprehension simple

On veut une liste contenant les CARRÉS des nombres PAIRS de 0 à 19.
Résultat attendu : [0, 4, 16, 36, 64, 100, 144, 196, 256, 324]

  1. Crée une liste appelée "carres_pairs"
  2. Pour chaque nombre x de 0 à 19, garde-le seulement si x est pair (x % 2 == 0)
  3. Mets x au carré (x**2)

💡 Hint : utilise range(20), puis le filtre 'if', puis l'expression x**2

────────────────────────────────────────
✅ EXERCICE 2 — Dict comprehension

On a une phrase. On veut un dictionnaire qui associe chaque mot à sa longueur.

phrase = "le data engineering c'est cool"

Résultat attendu :
{'le': 2, 'data': 4, 'engineering': 11, "c'est": 5, 'cool': 4}

  1. Découpe la phrase en mots avec phrase.split()
  2. Crée un dict comprehension : { mot: longueur for chaque mot }

💡 Hint : la syntaxe dict est { key: value for ... in ... }

────────────────────────────────────────
✅ EXERCICE 3 — Filtrer des points GPS

On a une liste de points GPS (latitude, longitude). Certains sont invalides
(coordonnées hors de Terre). Garde seulement les VALIDES.

points = [(48.8, 2.3), (200, 50), (45.7, 4.8), (-100, 30), (43.6, 1.4)]

Règles :
  • lat doit être entre -90 et 90
  • lon doit être entre -180 et 180

Résultat attendu : [(48.8, 2.3), (45.7, 4.8), (43.6, 1.4)]

💡 Hint : tu peux décompacter avec "for lat, lon in points"

────────────────────────────────────────
🎁 BONUS — Aplatir une matrice (nested comprehension)

On a une matrice 2D. On veut une liste 1D de tous les éléments.

matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

Résultat attendu : [1, 2, 3, 4, 5, 6, 7, 8, 9]

💡 Hint : 2 boucles for imbriquées dans la comprehension
[ ... for ligne in matrix for x in ligne ]

────────────────────────────────────────
⚠️ PIÈGES À ÉVITER
  • Ne pas confondre list [] et generator ()
    [x for x in range(1000)]  →  liste en mémoire
    (x for x in range(1000))  →  générateur (lazy, vu plus tard)
  • Si la comprehension dépasse 80 caractères, écris une boucle classique
    (la lisibilité avant la concision)`,
        solution: `# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 1 — Carrés des nombres pairs
# ═══════════════════════════════════════════════════════

# Méthode 1 : avec une boucle classique (pour comprendre)
carres_pairs = []
for x in range(20):
    if x % 2 == 0:           # x est pair si reste de la division par 2 = 0
        carres_pairs.append(x ** 2)
# Résultat : [0, 4, 16, 36, 64, 100, 144, 196, 256, 324]

# Méthode 2 : la comprehension équivalente (1 ligne) ✨
carres_pairs = [x ** 2 for x in range(20) if x % 2 == 0]

# 🔍 Décodage de la ligne :
#   [ x**2          ← l'expression à mettre dans la liste
#     for x in range(20)   ← la boucle
#     if x % 2 == 0 ]      ← le filtre


# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 2 — Dict comprehension
# ═══════════════════════════════════════════════════════

phrase = "le data engineering c'est cool"
longueurs = {mot: len(mot) for mot in phrase.split()}

# 🔍 phrase.split() découpe à chaque espace :
# ['le', 'data', 'engineering', "c'est", 'cool']
#
# Pour chaque "mot" → on crée la paire { mot : len(mot) }

# Résultat : {'le': 2, 'data': 4, 'engineering': 11, "c'est": 5, 'cool': 4}


# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 3 — Filtrer points GPS valides
# ═══════════════════════════════════════════════════════

points = [(48.8, 2.3), (200, 50), (45.7, 4.8), (-100, 30), (43.6, 1.4)]

valides = [
    (lat, lon)
    for lat, lon in points              # on décompacte chaque tuple
    if -90 <= lat <= 90                 # latitude dans la plage Terre
    and -180 <= lon <= 180              # longitude dans la plage Terre
]
# Résultat : [(48.8, 2.3), (45.7, 4.8), (43.6, 1.4)]

# 💡 Astuce Python : -90 <= lat <= 90 (chaining) est ÉQUIVALENT à
#                    (lat >= -90) and (lat <= 90)
#    Plus court, plus lisible, c'est très Pythonique !


# ═══════════════════════════════════════════════════════
# 🎁 BONUS — Aplatir une matrice
# ═══════════════════════════════════════════════════════

matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# La double boucle se lit DE GAUCHE À DROITE
# (même ordre que les boucles imbriquées classiques)
plat = [x for ligne in matrix for x in ligne]
# Résultat : [1, 2, 3, 4, 5, 6, 7, 8, 9]

# 🔁 Équivalent en boucles classiques :
plat = []
for ligne in matrix:
    for x in ligne:
        plat.append(x)


# ═══════════════════════════════════════════════════════
# 💎 BONUS PRO — Set & Generator comprehensions
# ═══════════════════════════════════════════════════════

# Set comprehension : valeurs UNIQUES
nombres = [1, 2, 2, 3, 3, 3, 4]
uniques = {x for x in nombres}     # {1, 2, 3, 4}

# Generator (avec parenthèses) : LAZY, ne consomme pas de RAM
gen = (x ** 2 for x in range(10_000_000))   # quasi instantané
# vs [x ** 2 for x in range(10_000_000)] qui prend ~80MB de RAM`,
      },
      {
        id: "d2",
        label: "Decorators, lambda, *args/**kwargs",
        day: "Mar",
        description: "Trois concepts qui rendent Python ultra flexible : LAMBDA = mini-fonction sur une ligne, *args/**kwargs = accepter un nombre variable d'arguments, DECORATOR = ajouter du comportement (logging, timing, retry) à une fonction sans modifier son code. C'est la base pour écrire du code réutilisable.",
        url: "https://realpython.com/primer-on-python-decorators/",
        resource: "Real Python — Decorators Primer",
        resources: [
          { type: "article", title: "Real Python — Decorators (le meilleur tuto)", url: "https://realpython.com/primer-on-python-decorators/" },
          { type: "article", title: "Real Python — *args et **kwargs", url: "https://realpython.com/python-kwargs-and-args/" },
          { type: "doc", title: "Python Docs — functools.wraps", url: "https://docs.python.org/3/library/functools.html#functools.wraps" },
          { type: "video", title: "Corey Schafer Decorators (30 min)", url: "https://youtu.be/FsAPt_9Bf3U" },
        ],
        exercise: `🎯 OBJECTIF
Maîtriser lambda, *args/**kwargs et écrire ton premier décorateur.

📚 RAPPEL DU CONCEPT
• LAMBDA : une mini-fonction sans nom
    lambda x: x * 2          ≡    def f(x): return x * 2
    Utilisée surtout avec sorted(), map(), filter()

• *args : accepte N arguments POSITIONNELS sous forme de tuple
    def f(*args): print(args)
    f(1, 2, 3)  →  (1, 2, 3)

• **kwargs : accepte N arguments NOMMÉS sous forme de dict
    def f(**kwargs): print(kwargs)
    f(a=1, b=2)  →  {'a': 1, 'b': 2}

• DECORATOR : une fonction qui transforme une autre fonction
    @mon_decorator
    def ma_fonction(): ...
    ≡  ma_fonction = mon_decorator(ma_fonction)

────────────────────────────────────────
✅ EXERCICE 1 — Lambda + sorted

On a une liste de tuples (nom, âge). Trie-la par âge.

personnes = [("Alice", 30), ("Bob", 25), ("Clara", 35), ("David", 28)]

Résultat attendu :
[("Bob", 25), ("David", 28), ("Alice", 30), ("Clara", 35)]

  1. Utilise sorted(personnes, key=...)
  2. La key est une lambda qui prend un tuple et renvoie l'âge

💡 Hint : sorted(liste, key=lambda x: x[INDEX_DE_L_AGE])

────────────────────────────────────────
✅ EXERCICE 2 — Fonction avec *args et **kwargs

Crée une fonction "log_appel(*args, **kwargs)" qui :
  • Affiche le nombre d'arguments positionnels reçus
  • Affiche tous les arguments nommés reçus

Test :
  log_appel(1, 2, 3, nom="Alice", ville="Paris")

Sortie attendue :
  3 arguments positionnels: (1, 2, 3)
  Arguments nommés: {'nom': 'Alice', 'ville': 'Paris'}

────────────────────────────────────────
✅ EXERCICE 3 — Ton premier DÉCORATEUR @timer

Écris un décorateur "timer" qui mesure le temps d'exécution d'une fonction.

Utilisation attendue :
  @timer
  def lecture_lente():
      time.sleep(1.5)
      return "ok"

  lecture_lente()
  # → ⏱  lecture_lente a pris 1.50s
  # → renvoie "ok"

Étapes :
  1. import time
  2. Définis "def timer(fn):"
  3. À l'intérieur, définis une fonction interne qui :
     a) note le temps de début
     b) appelle fn(*args, **kwargs) pour passer ses arguments
     c) note le temps de fin et l'affiche
     d) renvoie le résultat
  4. Renvoie la fonction interne

💡 Hint : la structure typique d'un décorateur est :
  def timer(fn):
      def wrapper(*args, **kwargs):
          # ... avant l'appel
          resultat = fn(*args, **kwargs)
          # ... après l'appel
          return resultat
      return wrapper

────────────────────────────────────────
🎁 BONUS — Décorateur @retry avec paramètres

Crée @retry(max_attempts=3) qui retente automatiquement une fonction
si elle plante (utile pour les appels API qui peuvent échouer).

  @retry(max_attempts=3)
  def appel_api():
      ...

💡 Indice : c'est un décorateur qui prend des paramètres
→ il faut UNE fonction qui renvoie UN décorateur (3 niveaux de fonctions)

────────────────────────────────────────
⚠️ PIÈGES À ÉVITER
  • Oublier @functools.wraps(fn) → tu perds le nom et la docstring
  • Confondre *args et **kwargs (positionnel vs nommé)
  • Lambda qui dépasse 1 ligne → utilise une vraie fonction def`,
        solution: `import time
import functools

# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 1 — Lambda + sorted
# ═══════════════════════════════════════════════════════

personnes = [("Alice", 30), ("Bob", 25), ("Clara", 35), ("David", 28)]

# La lambda reçoit un tuple p et renvoie p[1] (l'âge, à l'index 1)
trie_par_age = sorted(personnes, key=lambda p: p[1])
# [('Bob', 25), ('David', 28), ('Alice', 30), ('Clara', 35)]

# 💡 Trier par NOM (index 0) :
trie_par_nom = sorted(personnes, key=lambda p: p[0])

# 💡 Décroissant : ajoute reverse=True
trie_decroissant = sorted(personnes, key=lambda p: p[1], reverse=True)


# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 2 — *args et **kwargs
# ═══════════════════════════════════════════════════════

def log_appel(*args, **kwargs):
    # args est un TUPLE de tous les arguments positionnels
    # kwargs est un DICT de tous les arguments nommés
    print(f"{len(args)} arguments positionnels: {args}")
    print(f"Arguments nommés: {kwargs}")

log_appel(1, 2, 3, nom="Alice", ville="Paris")
# 3 arguments positionnels: (1, 2, 3)
# Arguments nommés: {'nom': 'Alice', 'ville': 'Paris'}

# 🔍 Le * et ** sont juste une CONVENTION Python.
# Tu pourrais écrire *banane et **carotte, ça marcherait.
# Mais TOUJOURS écrire *args et **kwargs (lisibilité).


# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 3 — Décorateur @timer
# ═══════════════════════════════════════════════════════

def timer(fn):
    # @functools.wraps préserve le nom et la doc de la fonction décorée
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        debut = time.time()                      # ⏱  avant
        resultat = fn(*args, **kwargs)           # appel réel
        duree = time.time() - debut              # ⏱  après
        print(f"⏱  {fn.__name__} a pris {duree:.2f}s")
        return resultat                           # ⚠️  ne pas oublier !
    return wrapper

# Utilisation
@timer
def lecture_lente():
    time.sleep(1.5)
    return "ok"

resultat = lecture_lente()
# ⏱  lecture_lente a pris 1.50s
print(resultat)  # "ok"

# 🔍 SOUS LE CAPOT : @timer est ÉQUIVALENT à
#    lecture_lente = timer(lecture_lente)


# ═══════════════════════════════════════════════════════
# 🎁 BONUS — @retry avec paramètres (3 niveaux)
# ═══════════════════════════════════════════════════════

def retry(max_attempts=3, delay=1):
    """Décorateur AVEC paramètres : 3 niveaux de fonctions imbriquées."""
    def decorator(fn):                                # niveau 2 : reçoit la fn
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):                 # niveau 3 : appel réel
            for tentative in range(1, max_attempts + 1):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:
                    print(f"❌ Tentative {tentative}/{max_attempts} : {e}")
                    if tentative == max_attempts:
                        raise                          # on ré-lève la dernière
                    time.sleep(delay * (2 ** (tentative - 1)))   # backoff exp
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5)
def appel_api_instable():
    import random
    if random.random() < 0.7:
        raise ConnectionError("API down")
    return "données"

# 🔍 Pourquoi 3 niveaux ?
#   @retry(max_attempts=3) appelle retry(3) qui RENVOIE le décorateur
#   Le décorateur est ensuite appliqué à la fonction
#   Chaque niveau a un rôle :
#     1. retry()    → capture les paramètres (max_attempts, delay)
#     2. decorator()→ reçoit la fonction à décorer
#     3. wrapper()  → fait le vrai boulot lors de chaque appel`,
      },
      {
        id: "d3",
        label: "Générateurs et yield",
        day: "Mer",
        description: "Un générateur est une fonction qui produit ses valeurs UNE PAR UNE à la demande, au lieu de tout calculer d'un coup. Imagine un distributeur de bonbons : tu prends 1 bonbon, le suivant attend. C'est essentiel pour traiter des fichiers énormes (10M+ lignes) sans saturer la RAM.",
        url: "https://realpython.com/introduction-to-python-generators/",
        resource: "Real Python — Generators",
        resources: [
          { type: "article", title: "Real Python — Generators (tuto complet)", url: "https://realpython.com/introduction-to-python-generators/" },
          { type: "doc", title: "Python Docs — yield expression", url: "https://docs.python.org/3/reference/expressions.html#yield-expressions" },
          { type: "doc", title: "Python Docs — itertools", url: "https://docs.python.org/3/library/itertools.html" },
          { type: "video", title: "Corey Schafer (11 min)", url: "https://youtu.be/bD05uGo_sVI" },
        ],
        exercise: `🎯 OBJECTIF
Comprendre la différence entre une fonction qui RETURN et une fonction qui YIELD.
Économiser de la RAM en traitant les données paresseusement (lazy).

📚 RAPPEL DU CONCEPT

Fonction normale (return) : calcule TOUT puis renvoie tout d'un coup
    def carres(n):
        result = []
        for x in range(n):
            result.append(x * x)
        return result    # ← stocke 10M valeurs en RAM si n=10M

Générateur (yield) : produit UNE valeur à chaque "next()", puis attend
    def carres(n):
        for x in range(n):
            yield x * x  # ← suspend la fonction, reprend à l'itération suivante

Mot-clé YIELD : c'est comme RETURN sauf que la fonction ne meurt pas,
elle se met en pause et reprend où elle en était au prochain appel.

────────────────────────────────────────
✅ EXERCICE 1 — Ton premier générateur

Écris une fonction "compte_jusqu_a(n)" qui produit les nombres de 0 à n-1
ET imprime un message à chaque valeur produite (pour bien voir le flow).

  def compte_jusqu_a(n):
      ???

Test :
  for i in compte_jusqu_a(3):
      print("Reçu:", i)

Sortie attendue :
  Production: 0
  Reçu: 0
  Production: 1
  Reçu: 1
  Production: 2
  Reçu: 2

🔍 Note bien que les "Production:" et "Reçu:" sont ENTRELACÉS.
Ça prouve que le générateur produit à la demande (et pas tout d'un coup).

────────────────────────────────────────
✅ EXERCICE 2 — Comparer la RAM

Mesure la taille mémoire de :
  • une LISTE des nombres de 0 à 9_999_999 (avec [...])
  • un GÉNÉRATEUR pour les mêmes nombres (avec (...))

Utilise sys.getsizeof().

Résultat attendu (approximatif) :
  Liste:      ~80 000 000 octets (80 MB)
  Générateur: ~200 octets

💡 Hint :
  liste = [x for x in range(10_000_000)]    ← liste comprehension
  gen   = (x for x in range(10_000_000))    ← generator expression

  La SEULE différence : [] vs () — mais comportement totalement différent !

────────────────────────────────────────
✅ EXERCICE 3 — Lecture lazy d'un fichier

Imagine un fichier "data.csv" de 10 GB avec une colonne "speed".
On veut filtrer les lignes où speed > 50, SANS charger tout en RAM.

Écris une fonction "filtrer_vitesse(chemin, seuil)" qui YIELD chaque
ligne valide une à la fois.

Format du CSV (tu peux simuler avec ces lignes) :
  vehicle_id,speed,distance
  V001,30,5.2
  V002,75,12.3
  V003,45,8.1
  V004,120,2.7

Étapes :
  1. Ouvre le fichier
  2. Skip la 1ère ligne (header)
  3. Pour chaque ligne, parse-la (split par virgule)
  4. Si speed > seuil → yield la ligne (sous forme de dict)

💡 Hint : utilise next(file) pour skip le header

────────────────────────────────────────
🎁 BONUS — Pipeline de générateurs (lecture → filtre → transform)

Écris 3 fonctions qui se chaînent, chacune utilisant yield :

  source     → lit les nombres de 1 à 1_000_000
  pairs      → garde seulement les pairs
  carres     → met chaque nombre au carré

Utilisation :
  resultat = carres(pairs(source(1_000_000)))
  for x in resultat:
      ...

🔍 Tout ça consomme quasi 0 RAM même avec 1 million d'éléments !

────────────────────────────────────────
⚠️ PIÈGES À ÉVITER
  • Un générateur ne peut être PARCOURU QU'UNE SEULE FOIS
    Si tu fais "for x in gen" 2 fois, le 2e tour sera vide.
  • Tu ne peux pas faire len(gen) ou gen[5] (pas de longueur, pas d'index)
    Si tu en as besoin → list(gen) (mais tu perds l'avantage RAM)
  • next(gen) lève StopIteration quand fini
    Le for boucle gère ça automatiquement`,
        solution: `import sys

# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 1 — Ton premier générateur
# ═══════════════════════════════════════════════════════

def compte_jusqu_a(n):
    for i in range(n):
        print(f"Production: {i}")
        yield i                       # ← suspend ici, attend le prochain "next"

for i in compte_jusqu_a(3):
    print(f"Reçu: {i}")

# Production: 0
# Reçu: 0
# Production: 1
# Reçu: 1
# Production: 2
# Reçu: 2

# 🔍 La fonction se met en PAUSE après chaque yield.
#    Quand le for demande la valeur suivante, elle REPREND où elle s'était arrêtée.
#    C'est de la magie Python (en réalité : une co-routine basique).


# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 2 — Mesurer la RAM
# ═══════════════════════════════════════════════════════

# Crée 10 millions d'éléments
liste = [x for x in range(10_000_000)]   # ⚠️  utilise ~80 MB
gen   = (x for x in range(10_000_000))   # 200 octets seulement !

print(f"Liste:      {sys.getsizeof(liste):>12_} octets")
print(f"Générateur: {sys.getsizeof(gen):>12_} octets")

# Liste:        80_000_056 octets   (80 MB)
# Générateur:          200 octets   (0.0002 MB)
#
# 💡 Le générateur ne stocke PAS les valeurs.
#    Il stocke juste la "recette" (le code) et reproduit chaque valeur à la demande.


# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 3 — Lecture lazy de CSV
# ═══════════════════════════════════════════════════════

def filtrer_vitesse(chemin, seuil):
    """Yield chaque ligne où speed > seuil, SANS charger le fichier en RAM."""
    with open(chemin) as f:
        header = next(f).strip().split(',')   # skip header + récupère les noms
        for ligne in f:                        # itère ligne par ligne (lazy)
            valeurs = ligne.strip().split(',')
            ligne_dict = dict(zip(header, valeurs))
            if float(ligne_dict['speed']) > seuil:
                yield ligne_dict

# Utilisation : tu peux processer un fichier de 100 GB sur ta machine de 8 GB RAM
for trip in filtrer_vitesse('data.csv', seuil=50):
    print(trip)
    # {'vehicle_id': 'V002', 'speed': '75', 'distance': '12.3'}
    # {'vehicle_id': 'V004', 'speed': '120', 'distance': '2.7'}

# 🔍 Pourquoi c'est puissant ?
#    Sans yield : pour 10 GB de CSV, il faudrait 10 GB de RAM ❌
#    Avec yield : chaque ligne est lue, traitée, jetée. RAM constante ✅


# ═══════════════════════════════════════════════════════
# 🎁 BONUS — Pipeline de générateurs
# ═══════════════════════════════════════════════════════

def source(n):
    """Produit les nombres de 1 à n."""
    for x in range(1, n + 1):
        yield x

def pairs(stream):
    """Garde uniquement les nombres pairs."""
    for x in stream:
        if x % 2 == 0:
            yield x

def carres(stream):
    """Met chaque nombre au carré."""
    for x in stream:
        yield x * x

# Composition : 3 générateurs chaînés, comme un pipeline Unix (cat | grep | awk)
pipeline = carres(pairs(source(1_000_000)))

# Aucun calcul fait pour l'instant ! (lazy)
# Le calcul démarre seulement quand on itère :
total = sum(pipeline)   # parcours unique, RAM minuscule
print(total)

# 🔍 Avantages :
#    1. Composable (chaque étape réutilisable)
#    2. Économe en RAM (1 valeur à la fois traverse le pipeline)
#    3. Lazy : si tu fais next(pipeline) 5 fois, tu calcules juste 5 valeurs


# ═══════════════════════════════════════════════════════
# 💎 ASTUCES PRO
# ═══════════════════════════════════════════════════════

# itertools : librairie standard avec plein de générateurs utiles
from itertools import islice, chain, takewhile, groupby

# Premiers 10 éléments d'un gen
premiers = list(islice(source(1_000_000), 10))   # [1,2,3,4,5,6,7,8,9,10]

# Concaténer plusieurs gens
combined = chain(source(3), source(3))           # [1,2,3,1,2,3]

# Prendre tant que la condition est vraie
small = list(takewhile(lambda x: x < 5, source(1_000_000)))   # [1,2,3,4]

# yield from : déléguer à un autre générateur
def double_pipeline():
    yield from source(3)         # ≡ for x in source(3): yield x
    yield from source(3)`,
      },
      {
        id: "d4",
        label: "Classes et OOP",
        day: "Jeu",
        description: "Une classe est un MOULE pour créer des objets. L'objet a des données (attributs : self.lat) et des comportements (méthodes : self.distance_to()). Tu utilises l'OOP quand plusieurs fonctions liées partagent un état (un pipeline ETL, un connecteur DB, un point GPS). Aujourd'hui, on préfère @dataclass (Python 3.7+) qui réduit le boilerplate.",
        url: "https://realpython.com/python3-object-oriented-programming/",
        resource: "Real Python — OOP",
        resources: [
          { type: "article", title: "Real Python — OOP Complet", url: "https://realpython.com/python3-object-oriented-programming/" },
          { type: "doc", title: "Python Docs — Classes", url: "https://docs.python.org/3/tutorial/classes.html" },
          { type: "doc", title: "Python Docs — dataclasses (RECOMMANDÉ)", url: "https://docs.python.org/3/library/dataclasses.html" },
          { type: "article", title: "Real Python — dataclass", url: "https://realpython.com/python-data-classes/" },
        ],
        exercise: `🎯 OBJECTIF
Créer ta première classe Python pour modéliser un point GPS,
puis utiliser l'héritage et @dataclass pour simplifier.

📚 RAPPEL DU CONCEPT

Classe :
    class NomClasse:
        def __init__(self, x):       ← le "constructeur"
            self.x = x                ← attribut

        def methode(self):
            return self.x * 2         ← method qui utilise self

Instance :
    obj = NomClasse(5)
    obj.methode()  →  10

Mots-clés importants :
  • self      : référence à l'instance (toujours 1er argument)
  • __init__  : exécuté à la création de l'objet
  • __repr__  : représentation lisible (print(obj))
  • @dataclass: génère __init__, __repr__, __eq__ automatiquement

────────────────────────────────────────
✅ EXERCICE 1 — Première classe : GPSPoint

Crée une classe GPSPoint qui représente un point GPS.

Attributs :
  • lat (float)
  • lon (float)
  • speed (float, par défaut 0.0)

Méthodes :
  • is_valid() → renvoie True si lat∈[-90,90] et lon∈[-180,180]
  • __repr__() → renvoie "GPSPoint(48.85, 2.35)" (joli affichage)

Test :
  p1 = GPSPoint(48.85, 2.35, speed=50)
  print(p1)               # GPSPoint(48.85, 2.35)
  print(p1.is_valid())    # True

  p2 = GPSPoint(200, 50)
  print(p2.is_valid())    # False

────────────────────────────────────────
✅ EXERCICE 2 — Refais avec @dataclass (moderne)

Le code de l'exercice 1 a beaucoup de boilerplate. @dataclass génère
__init__ et __repr__ automatiquement.

Refais GPSPoint en utilisant @dataclass.

  from dataclasses import dataclass

  @dataclass
  class GPSPoint:
      lat: float
      lon: float
      speed: float = 0.0

      def is_valid(self) -> bool:
          ???

🔍 Beaucoup moins de code ! Le @dataclass crée __init__ et __repr__ pour toi.

────────────────────────────────────────
✅ EXERCICE 3 — Une vraie classe utile : DataPipeline

Crée une classe DataPipeline qui chaîne plusieurs transformations.

  • Méthode add_step(fonction) → ajoute une étape, RENVOIE self (pour chaîner)
  • Méthode run(data)         → applique toutes les étapes en ordre
  • __repr__                   → "<Pipeline 'mon_etl': 3 steps>"

Utilisation attendue :
  pipeline = (DataPipeline("nettoyage")
              .add_step(lambda lst: [x for x in lst if x > 0])   # filtre négatifs
              .add_step(lambda lst: [x * 2 for x in lst])        # double
              .add_step(sum))                                     # somme

  resultat = pipeline.run([-1, 2, 3, -5, 10])
  # → étape 1 garde [2, 3, 10]
  # → étape 2 donne [4, 6, 20]
  # → étape 3 donne 30

  print(pipeline)        # <Pipeline 'nettoyage': 3 steps>
  print(resultat)         # 30

💡 Hint : "return self" à la fin de add_step() permet le chaînage .add().add()

────────────────────────────────────────
🎁 BONUS — Héritage : GPSPipeline spécialisé

Crée GPSPipeline qui HÉRITE de DataPipeline et ajoute une méthode
add_geo_filter(bbox) qui ajoute automatiquement un filtre géo.

  bbox = (min_lat, max_lat, min_lon, max_lon)

  pipe = (GPSPipeline("paris")
          .add_geo_filter((48.8, 48.9, 2.3, 2.4))
          .add_step(lambda pts: len(pts)))

  pipe.run([GPSPoint(48.85, 2.35), GPSPoint(40, 0)])
  # → 1 (seul le point de Paris passe)

💡 Hint : class GPSPipeline(DataPipeline): ...

────────────────────────────────────────
⚠️ PIÈGES À ÉVITER
  • Oublier "self" en 1er argument → erreur classique débutant
  • Modifier un attribut sans self.x = ... (juste x = ... crée une variable locale)
  • @dataclass + valeurs mutables : utilise field(default_factory=list)
    PAS list = [] (piège de mutabilité partagée)
  • __repr__ vs __str__ : __repr__ pour debug, __str__ pour user
    Si tu n'as qu'un seul, fais __repr__`,
        solution: `from dataclasses import dataclass, field
from typing import Callable, Any

# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 1 — Classe traditionnelle
# ═══════════════════════════════════════════════════════

class GPSPoint:
    def __init__(self, lat: float, lon: float, speed: float = 0.0):
        # self.x = ... → crée un ATTRIBUT sur l'instance
        self.lat = lat
        self.lon = lon
        self.speed = speed

    def is_valid(self) -> bool:
        # self pour accéder aux attributs de l'instance
        return -90 <= self.lat <= 90 and -180 <= self.lon <= 180

    def __repr__(self) -> str:
        # Représentation utilisée par print() et dans les listes
        return f"GPSPoint({self.lat}, {self.lon})"

p1 = GPSPoint(48.85, 2.35, speed=50)
print(p1)               # GPSPoint(48.85, 2.35)
print(p1.is_valid())    # True

p2 = GPSPoint(200, 50)
print(p2.is_valid())    # False

# 🔍 self est OBLIGATOIRE comme 1er argument de chaque méthode.
#    Quand tu appelles p1.is_valid(), Python passe automatiquement p1 comme self.


# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 2 — Version @dataclass (moderne)
# ═══════════════════════════════════════════════════════

@dataclass
class GPSPoint:
    lat: float
    lon: float
    speed: float = 0.0

    def is_valid(self) -> bool:
        return -90 <= self.lat <= 90 and -180 <= self.lon <= 180

# C'est tout ! Le @dataclass génère AUTO :
#   - __init__(self, lat, lon, speed=0.0)
#   - __repr__ → GPSPoint(lat=48.85, lon=2.35, speed=0.0)
#   - __eq__   → comparaison entre 2 GPSPoint

p1 = GPSPoint(48.85, 2.35, speed=50)
p2 = GPSPoint(48.85, 2.35, speed=50)
print(p1 == p2)         # True (égalité automatique !)


# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 3 — Classe DataPipeline
# ═══════════════════════════════════════════════════════

class DataPipeline:
    def __init__(self, name: str):
        self.name = name
        self.steps: list[Callable] = []      # liste de fonctions

    def add_step(self, fn: Callable) -> "DataPipeline":
        self.steps.append(fn)
        return self                           # ⭐ permet le chaînage

    def run(self, data: Any) -> Any:
        # Applique chaque étape sur le résultat de la précédente
        for step in self.steps:
            data = step(data)
        return data

    def __repr__(self) -> str:
        return f"<Pipeline '{self.name}': {len(self.steps)} steps>"

# Utilisation — beauté du chainable design pattern
pipeline = (
    DataPipeline("nettoyage")
    .add_step(lambda lst: [x for x in lst if x > 0])    # filtre négatifs
    .add_step(lambda lst: [x * 2 for x in lst])         # double
    .add_step(sum)                                       # somme
)

print(pipeline)                                  # <Pipeline 'nettoyage': 3 steps>
print(pipeline.run([-1, 2, 3, -5, 10]))         # 30


# ═══════════════════════════════════════════════════════
# 🎁 BONUS — Héritage : GPSPipeline
# ═══════════════════════════════════════════════════════

class GPSPipeline(DataPipeline):
    """Hérite de DataPipeline et ajoute des méthodes spécifiques GPS."""

    def add_geo_filter(self, bbox: tuple) -> "GPSPipeline":
        min_lat, max_lat, min_lon, max_lon = bbox

        def filter_fn(points):
            return [
                p for p in points
                if min_lat <= p.lat <= max_lat and min_lon <= p.lon <= max_lon
            ]

        self.add_step(filter_fn)
        return self

# Test
points = [
    GPSPoint(48.85, 2.35),    # Paris ✓
    GPSPoint(40.0, 0.0),       # ailleurs ✗
    GPSPoint(48.86, 2.36),    # Paris ✓
]

pipe = (
    GPSPipeline("zone_paris")
    .add_geo_filter((48.8, 48.9, 2.3, 2.4))   # bbox Paris
    .add_step(len)                              # compte
)

print(pipe.run(points))         # 2

# 🔍 GPSPipeline HÉRITE de toutes les méthodes de DataPipeline
#    et en AJOUTE de nouvelles spécifiques à GPS.


# ═══════════════════════════════════════════════════════
# 💎 ASTUCES PRO @dataclass
# ═══════════════════════════════════════════════════════

@dataclass
class Dataset:
    name: str
    points: list = field(default_factory=list)   # ⚠️  pas list = [] !

    def __len__(self) -> int:                    # → len(dataset)
        return len(self.points)

    @property                                     # → dataset.avg_speed (sans ())
    def avg_speed(self) -> float:
        if not self.points:
            return 0.0
        return sum(p.speed for p in self.points) / len(self.points)

# Méthodes spéciales (dunder methods) qui rendent ta classe "pythonique" :
#   __len__      → len(obj)
#   __iter__     → for x in obj
#   __getitem__  → obj[5]
#   __contains__ → x in obj
#   __add__      → obj1 + obj2
#   __eq__       → obj1 == obj2`,
      },
      {
        id: "d5",
        label: "Error handling + Logging",
        day: "Ven",
        description: "En prod, ton pipeline tournera tout seul à 4h du matin. Sans logs : impossible de savoir s'il a marché ou pourquoi il a planté. print() c'est pour le dev, logging c'est pour la prod. Les exceptions custom (ex: DataQualityError) rendent les erreurs métier explicites au lieu d'un ValueError générique.",
        url: "https://realpython.com/python-logging/",
        resource: "Real Python — Logging",
        resources: [
          { type: "article", title: "Real Python — Logging Guide", url: "https://realpython.com/python-logging/" },
          { type: "doc", title: "Python Docs — logging HOWTO", url: "https://docs.python.org/3/howto/logging.html" },
          { type: "doc", title: "Python Docs — Exceptions", url: "https://docs.python.org/3/tutorial/errors.html" },
          { type: "github", title: "loguru — logging moderne (alternative)", url: "https://github.com/Delgan/loguru" },
        ],
        exercise: `🎯 OBJECTIF
Remplacer print() par un vrai logger, créer des exceptions personnalisées,
et gérer proprement les erreurs avec try/except.

📚 RAPPEL DU CONCEPT

🔥 LOGGING vs PRINT
  print("ok")              → simple, pas de niveau, va dans stdout
  log.info("ok")           → a un niveau, un timestamp, format custom

5 niveaux (du moins au plus grave) :
  DEBUG    → détails techniques
  INFO     → étapes normales
  WARNING  → quelque chose d'anormal mais pas bloquant
  ERROR    → une erreur (mais le programme continue)
  CRITICAL → erreur fatale

🚨 EXCEPTIONS
  try:
      operation_risquee()
  except TypeErreurSpecifique as e:
      gerer(e)
  except Exception as e:    # catch-all (à éviter en général)
      log.exception(e)
  finally:
      nettoyage()           # toujours exécuté

Custom exception : juste une classe qui hérite de Exception
  class MonErreur(Exception):
      """Mon erreur métier."""

────────────────────────────────────────
✅ EXERCICE 1 — Setup d'un logger basique

Configure un logger qui :
  • Écrit dans la console ET dans un fichier "pipeline.log"
  • Format : "2026-05-08 10:23:45 [INFO] mon_etl: Message"
  • Niveau minimum : INFO

Test :
  log.debug("ne s'affiche pas")    # niveau DEBUG < INFO
  log.info("commence")
  log.warning("attention")
  log.error("erreur grave")

💡 Hint : utilise logging.basicConfig() avec :
  • level=logging.INFO
  • format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
  • handlers=[FileHandler('...'), StreamHandler()]

────────────────────────────────────────
✅ EXERCICE 2 — Exception personnalisée

Crée 2 exceptions personnalisées pour ton ETL :

  • DataQualityError → quand les données ne respectent pas un contrat
  • SourceMissingError → quand un fichier source est introuvable

Puis écris une fonction valider_age(age) qui :
  • Lève DataQualityError si age est négatif
  • Lève DataQualityError si age > 120 (suspect)
  • Retourne age sinon

Test :
  valider_age(25)    # 25
  valider_age(-1)    # DataQualityError: age négatif (-1)
  valider_age(150)   # DataQualityError: age suspect (150)

────────────────────────────────────────
✅ EXERCICE 3 — Try/except complet

Écris une fonction "lire_csv_safe(chemin)" qui charge un CSV et
gère TOUS les cas d'erreur proprement avec logging.

Cas à gérer :
  1. Fichier inexistant     → log ERROR + lève SourceMissingError
  2. Fichier vide            → log WARNING + retourne []
  3. Erreur de parsing       → log EXCEPTION (avec stacktrace) + ré-raise
  4. Tout va bien            → log INFO du nombre de lignes + retourne données

Étapes :
  1. Vérifie que le fichier existe (Path.exists())
  2. Lis le contenu
  3. Parse les lignes (split par newline, puis par virgule)
  4. Gère les exceptions à chaque étape

💡 Hint : utilise log.exception() dans except → ça inclut le stacktrace

────────────────────────────────────────
🎁 BONUS — Décorateur @log_calls

Crée un décorateur qui log automatiquement chaque appel d'une fonction :
  • Avant l'appel : log les arguments
  • Après l'appel : log le résultat
  • Si exception : log l'erreur

  @log_calls
  def addition(a, b):
      return a + b

  addition(3, 5)
  # 📞 addition(args=(3, 5), kwargs={})
  # ✅ addition → 8

────────────────────────────────────────
⚠️ PIÈGES À ÉVITER
  • print() dans une lib → MAL (pas de niveau, pas de timestamp)
  • except Exception sans log → tu perds l'info, debug enfer
  • raise vs raise e : "raise" SEUL préserve le stacktrace (préféré)
  • Logger les MOTS DE PASSE / TOKENS → ne jamais faire`,
        solution: `import logging
import functools
from pathlib import Path

# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 1 — Setup logger
# ═══════════════════════════════════════════════════════

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler("pipeline.log", mode="a", encoding="utf-8"),
        logging.StreamHandler(),         # console (sys.stderr)
    ],
)

# Crée un logger nommé (mieux que le root logger)
log = logging.getLogger("mon_etl")

# Test
log.debug("ne s'affiche pas")           # DEBUG < INFO → ignoré
log.info("démarrage du pipeline")
log.warning("ressource à 80%")
log.error("connexion DB échouée")
# 2026-05-08 10:23:45 [INFO] mon_etl: démarrage du pipeline
# 2026-05-08 10:23:45 [WARNING] mon_etl: ressource à 80%
# 2026-05-08 10:23:45 [ERROR] mon_etl: connexion DB échouée

# 💡 Pourquoi un logger NOMMÉ ?
#   Tu peux configurer chaque module indépendamment :
#     logging.getLogger("mon_etl").setLevel(logging.DEBUG)
#     logging.getLogger("requests").setLevel(logging.WARNING)


# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 2 — Exceptions personnalisées
# ═══════════════════════════════════════════════════════

class DataQualityError(Exception):
    """Les données ne respectent pas le contrat métier."""

class SourceMissingError(FileNotFoundError):
    """Un fichier source est introuvable."""

def valider_age(age: int) -> int:
    if age < 0:
        raise DataQualityError(f"age négatif ({age})")
    if age > 120:
        raise DataQualityError(f"age suspect ({age})")
    return age

# Test
try:
    valider_age(150)
except DataQualityError as e:
    log.error(f"Validation échouée : {e}")
    # [ERROR] mon_etl: Validation échouée : age suspect (150)

# 🔍 Pourquoi des exceptions custom ?
#   Au lieu de raise ValueError("age suspect"), tu fais
#   raise DataQualityError("age suspect")
#   → tu peux DISTINGUER tes erreurs métier des erreurs Python natives
#   → tu peux les attraper séparément :
#         except DataQualityError: notify_data_team()
#         except OSError: retry()


# ═══════════════════════════════════════════════════════
# ✅ EXERCICE 3 — Try/except complet
# ═══════════════════════════════════════════════════════

def lire_csv_safe(chemin: str) -> list[dict]:
    """Lit un CSV en gérant tous les cas d'erreur."""
    p = Path(chemin)

    # Cas 1 : fichier inexistant
    if not p.exists():
        log.error(f"Fichier introuvable : {p}")
        raise SourceMissingError(f"Fichier introuvable : {p}")

    log.info(f"Lecture de {p}")

    try:
        contenu = p.read_text(encoding="utf-8").strip()

        # Cas 2 : fichier vide
        if not contenu:
            log.warning(f"{p} est vide")
            return []

        # Parse manuellement (juste pour l'exo)
        lignes = contenu.split("\\n")
        header = lignes[0].split(",")
        records = []
        for i, ligne in enumerate(lignes[1:], start=2):
            valeurs = ligne.split(",")
            if len(valeurs) != len(header):
                raise ValueError(f"Ligne {i}: attendu {len(header)} cols, reçu {len(valeurs)}")
            records.append(dict(zip(header, valeurs)))

        # Cas 4 : tout OK
        log.info(f"Chargé {len(records)} lignes depuis {p}")
        return records

    except UnicodeDecodeError:
        log.exception(f"Erreur encodage dans {p}")
        raise
    except ValueError as e:
        log.exception(f"Erreur parsing dans {p} : {e}")
        raise

# 🔍 log.exception() vs log.error()
#   log.error("msg")     → juste le message
#   log.exception("msg") → message + STACKTRACE complet
#   À utiliser DANS un except (sinon ça plante).


# ═══════════════════════════════════════════════════════
# 🎁 BONUS — Décorateur @log_calls
# ═══════════════════════════════════════════════════════

def log_calls(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        log.info(f"📞 {fn.__name__}(args={args}, kwargs={kwargs})")
        try:
            resultat = fn(*args, **kwargs)
            log.info(f"✅ {fn.__name__} → {resultat}")
            return resultat
        except Exception as e:
            log.exception(f"❌ {fn.__name__} a planté : {e}")
            raise
    return wrapper

@log_calls
def addition(a: int, b: int) -> int:
    return a + b

addition(3, 5)
# 📞 addition(args=(3, 5), kwargs={})
# ✅ addition → 8


# ═══════════════════════════════════════════════════════
# 💎 BEST PRACTICES PROD
# ═══════════════════════════════════════════════════════

# 1. Loggers par module (au début de chaque fichier .py)
#    log = logging.getLogger(__name__)
#    → tu obtiens "mon_package.sous_module" automatiquement

# 2. Pas de print() en prod, jamais

# 3. Logs structurés (JSON) pour gros systèmes
#    pip install python-json-logger
#    → parsable par Datadog, ELK, etc.

# 4. Lazy formatting (économise CPU si log filtré)
#    log.info("user %s spent %d", user, total)   # bon
#    log.info(f"user {user} spent {total}")       # f-string (toujours évalué)

# 5. Rotation automatique des fichiers
#    from logging.handlers import RotatingFileHandler
#    handler = RotatingFileHandler("app.log", maxBytes=10_000_000, backupCount=5)`,
      },
      {
        id: "d6",
        label: "Mini-projet ETL complet",
        day: "Sam",
        description: "Ton premier vrai projet portfolio qui combine TOUT ce que tu as appris cette semaine (comprehensions, decorators, generators, classes, logging). L'ETL (Extract → Transform → Load) est LE pattern de base du data engineering. Ce projet doit aller sur ton GitHub : c'est ta vitrine.",
        url: "https://www.kaggle.com/datasets/arashnic/taxi-trip-dataset",
        resource: "Kaggle — Taxi GPS Dataset",
        resources: [
          { type: "tool", title: "Kaggle — Taxi Trip Dataset", url: "https://www.kaggle.com/datasets/arashnic/taxi-trip-dataset" },
          { type: "article", title: "What is ETL? (AWS)", url: "https://aws.amazon.com/what-is/etl/" },
          { type: "github", title: "Cookiecutter Data Science", url: "https://github.com/drivendata/cookiecutter-data-science" },
          { type: "doc", title: "Python Project Structure (Hitchhiker's Guide)", url: "https://docs.python-guide.org/writing/structure/" },
        ],
        exercise: `🎯 OBJECTIF
Construire ton premier ETL Python proprement structuré, qui combine
TOUT ce que tu as appris cette semaine. Livrable : repo GitHub propre.

📚 RAPPEL : qu'est-ce qu'un ETL ?

  E (Extract)   → lire les données depuis une source (CSV, API, DB...)
  T (Transform) → nettoyer, valider, calculer, enrichir
  L (Load)      → écrire le résultat (CSV, Parquet, DB...)

C'est le pipeline le plus courant en data engineering.

────────────────────────────────────────
✅ ÉTAPE 1 — Structure du projet

Crée ce dossier (chaque fichier sera rempli après) :

  taxi-etl/
  ├── src/
  │   ├── __init__.py
  │   ├── extract.py        ← lecture du CSV
  │   ├── transform.py      ← nettoyage + features
  │   ├── load.py           ← écriture Parquet
  │   └── pipeline.py       ← orchestre extract → transform → load
  ├── tests/
  │   └── test_transform.py
  ├── data/
  │   ├── raw/              ← CSV téléchargé
  │   └── processed/        ← Parquet généré
  ├── requirements.txt
  ├── Makefile
  └── README.md

💡 Hint : Initie avec git, ajoute un .gitignore (data/, __pycache__, .venv).

────────────────────────────────────────
✅ ÉTAPE 2 — Module extract.py

Écris une fonction "lire_csv(chemin)" qui :
  • Vérifie que le fichier existe
  • Le charge avec pandas
  • Log le nombre de lignes lues
  • Retourne le DataFrame

💡 Hint : reprends la logique de l'exo d5 (lire_csv_safe).

────────────────────────────────────────
✅ ÉTAPE 3 — Module transform.py

Écris 3 fonctions de transformation :

  1. nettoyer(df) → drop les lignes avec lat/lon nuls ou hors plage
  2. ajouter_features(df) → calcule :
       • duree_minutes = (dropoff - pickup) en minutes
       • vitesse_kmh   = distance / (duree_minutes / 60)
       • heure         = heure du pickup (0-23)
  3. aggreger_par_heure(df) → groupby('heure').agg({...})

Toutes les fonctions doivent avoir des type hints :
  def nettoyer(df: pd.DataFrame) -> pd.DataFrame: ...

────────────────────────────────────────
✅ ÉTAPE 4 — Module pipeline.py

Crée une classe TaxiETL qui orchestre tout :
  • __init__(self, source: str, output: str)
  • run(self) → appelle extract, transform, load dans l'ordre
  • Décore run() avec @log_calls (de l'exo d5)

Utilisation attendue :
  etl = TaxiETL("data/raw/trips.csv", "data/processed/")
  etl.run()
  # 📞 run(...)
  # [INFO] Loading data/raw/trips.csv
  # [INFO] Loaded 1_000_000 rows
  # [INFO] Cleaned: 950_000 rows kept
  # [INFO] Wrote 24 partitions
  # ✅ run → ok

────────────────────────────────────────
✅ ÉTAPE 5 — Tests + README

  • tests/test_transform.py : 3 tests minimum (fixtures Pandas)
  • README.md : description + comment lancer + screenshots résultats
  • Makefile : commandes install / test / run / clean

────────────────────────────────────────
🎁 BONUS — Niveau pro

  • Type hints partout, "mypy src/" doit passer sans erreur
  • requirements.txt avec versions fixées
  • GitHub Actions qui run les tests à chaque push (.github/workflows/ci.yml)
  • CLI avec argparse : "python -m src.pipeline --input ... --output ..."
  • Une mini visualisation matplotlib dans un notebook

────────────────────────────────────────
🏆 CRITÈRES D'ÉVALUATION (recruteur qui regarde ton GitHub)
  ✓ README clair et professionnel
  ✓ Code modulaire (1 fichier = 1 responsabilité)
  ✓ Type hints + docstrings
  ✓ Tests qui passent
  ✓ Logging au lieu de print
  ✓ .gitignore propre (pas de data committed)
  ✓ Makefile pour démarrer en 1 commande`,
        solution: `# ═══════════════════════════════════════════════════════
# 📂 STRUCTURE FINALE DU PROJET
# ═══════════════════════════════════════════════════════
# taxi-etl/
# ├── src/
# │   ├── __init__.py
# │   ├── extract.py
# │   ├── transform.py
# │   ├── load.py
# │   └── pipeline.py
# ├── tests/
# │   └── test_transform.py
# ├── data/
# │   ├── raw/.gitkeep
# │   └── processed/.gitkeep
# ├── .gitignore
# ├── Makefile
# ├── README.md
# └── requirements.txt


# ═══════════════════════════════════════════════════════
# 📄 src/extract.py
# ═══════════════════════════════════════════════════════
import logging
from pathlib import Path
import pandas as pd

log = logging.getLogger(__name__)

class SourceMissingError(FileNotFoundError):
    """Fichier source introuvable."""

def lire_csv(chemin: str) -> pd.DataFrame:
    p = Path(chemin)
    if not p.exists():
        raise SourceMissingError(f"Introuvable : {p}")

    log.info(f"Loading {p}")
    df = pd.read_csv(p, parse_dates=["pickup_datetime", "dropoff_datetime"])
    log.info(f"Loaded {len(df):_} rows")
    return df


# ═══════════════════════════════════════════════════════
# 📄 src/transform.py
# ═══════════════════════════════════════════════════════
import logging
import pandas as pd

log = logging.getLogger(__name__)

def nettoyer(df: pd.DataFrame) -> pd.DataFrame:
    """Garde seulement les coordonnées GPS valides."""
    avant = len(df)
    df = df.dropna(subset=["pickup_lat", "pickup_lon"])
    df = df[
        df["pickup_lat"].between(-90, 90) &
        df["pickup_lon"].between(-180, 180)
    ].copy()
    log.info(f"Cleaned: {len(df):_} kept (dropped {avant - len(df):_})")
    return df

def ajouter_features(df: pd.DataFrame) -> pd.DataFrame:
    """Calcule durée, vitesse, heure."""
    df = df.copy()
    df["duree_minutes"] = (
        (df["dropoff_datetime"] - df["pickup_datetime"]).dt.total_seconds() / 60
    )
    df["vitesse_kmh"] = df["distance_km"] / (df["duree_minutes"] / 60)
    df["heure"] = df["pickup_datetime"].dt.hour
    return df

def aggreger_par_heure(df: pd.DataFrame) -> pd.DataFrame:
    """Stats par heure du jour."""
    return (
        df.groupby("heure")
          .agg(
              n_trips=("vitesse_kmh", "size"),
              vitesse_moy=("vitesse_kmh", "mean"),
              duree_moy=("duree_minutes", "mean"),
          )
          .reset_index()
    )


# ═══════════════════════════════════════════════════════
# 📄 src/load.py
# ═══════════════════════════════════════════════════════
import logging
from pathlib import Path
import pandas as pd

log = logging.getLogger(__name__)

def ecrire_parquet(df: pd.DataFrame, dossier: str, partition_col: str = "heure") -> None:
    Path(dossier).mkdir(parents=True, exist_ok=True)
    df.to_parquet(dossier, partition_cols=[partition_col], compression="snappy")
    log.info(f"Wrote {df[partition_col].nunique()} partitions in {dossier}")


# ═══════════════════════════════════════════════════════
# 📄 src/pipeline.py — orchestration
# ═══════════════════════════════════════════════════════
import functools
import logging

from .extract import lire_csv
from .transform import nettoyer, ajouter_features, aggreger_par_heure
from .load import ecrire_parquet

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()],
)
log = logging.getLogger("taxi_etl")

def log_calls(fn):
    @functools.wraps(fn)
    def wrapper(*a, **kw):
        log.info(f"📞 {fn.__name__}")
        try:
            r = fn(*a, **kw)
            log.info(f"✅ {fn.__name__} → ok")
            return r
        except Exception:
            log.exception(f"❌ {fn.__name__}")
            raise
    return wrapper

class TaxiETL:
    def __init__(self, source: str, output: str):
        self.source = source
        self.output = output

    @log_calls
    def run(self) -> None:
        df = lire_csv(self.source)
        df = nettoyer(df)
        df = ajouter_features(df)
        ecrire_parquet(df, f"{self.output}/trips_clean")
        agg = aggreger_par_heure(df)
        agg.to_csv(f"{self.output}/stats_par_heure.csv", index=False)


# Point d'entrée CLI
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="data/raw/trips.csv")
    parser.add_argument("--output", default="data/processed")
    args = parser.parse_args()

    TaxiETL(args.input, args.output).run()


# ═══════════════════════════════════════════════════════
# 📄 tests/test_transform.py
# ═══════════════════════════════════════════════════════
import pandas as pd
import pytest
from src.transform import nettoyer, ajouter_features

@pytest.fixture
def df_brut():
    return pd.DataFrame({
        "pickup_lat":  [48.85, 200, None,  43.6],
        "pickup_lon":  [2.35,  50,  4.8,   1.4],
        "pickup_datetime":  pd.to_datetime(["2026-01-01 08:00", "2026-01-01 09:00",
                                            "2026-01-01 10:00", "2026-01-01 11:00"]),
        "dropoff_datetime": pd.to_datetime(["2026-01-01 08:30", "2026-01-01 09:15",
                                            "2026-01-01 10:30", "2026-01-01 11:45"]),
        "distance_km": [10, 5, 7, 20],
    })

def test_nettoyer_supprime_invalides(df_brut):
    nettoye = nettoyer(df_brut)
    assert len(nettoye) == 2                 # 2 lignes valides
    assert nettoye["pickup_lat"].between(-90, 90).all()

def test_features_calcule_duree(df_brut):
    df = nettoyer(df_brut)
    df = ajouter_features(df)
    assert "duree_minutes" in df.columns
    assert df["duree_minutes"].iloc[0] == 30  # 8h00 → 8h30

def test_features_calcule_vitesse(df_brut):
    df = ajouter_features(nettoyer(df_brut))
    # 10 km en 30 min = 20 km/h
    assert df["vitesse_kmh"].iloc[0] == pytest.approx(20.0)


# ═══════════════════════════════════════════════════════
# 📄 Makefile
# ═══════════════════════════════════════════════════════
# .PHONY: install test run clean
# install:
# 	pip install -r requirements.txt
# test:
# 	pytest -v
# run:
# 	python -m src.pipeline --input data/raw/trips.csv --output data/processed
# clean:
# 	rm -rf data/processed/* __pycache__ .pytest_cache


# ═══════════════════════════════════════════════════════
# 📄 README.md (modèle)
# ═══════════════════════════════════════════════════════
# # 🚕 Taxi ETL
#
# Pipeline ETL qui transforme les courses de taxi NYC en stats horaires.
#
# ## 🎯 Ce que ça fait
# - **Extract** : charge un CSV de courses (1M+ lignes)
# - **Transform** : nettoie, calcule durée + vitesse + heure
# - **Load** : écrit en Parquet partitionné par heure
#
# ## 🚀 Quick start
# \`\`\`bash
# make install
# make test
# make run
# \`\`\`
#
# ## 📊 Résultats
# ![Stats par heure](docs/stats.png)
#
# ## 🛠 Stack
# Python 3.11 · Pandas · pytest · Parquet


# ═══════════════════════════════════════════════════════
# 💎 BONUS GitHub Actions (.github/workflows/ci.yml)
# ═══════════════════════════════════════════════════════
# name: CI
# on: [push, pull_request]
# jobs:
#   test:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       - uses: actions/setup-python@v5
#         with: { python-version: '3.11' }
#       - run: pip install -r requirements.txt
#       - run: pytest -v`,
      },
    ],
  },
  {
    id: "w2",
    title: "Pandas Maîtrisé",
    tasks: [
      {
        id: "d7",
        label: "DataFrame, Series, filtres",
        day: "Lun",
        description: "Pandas est LA bibliothèque pour manipuler des données tabulaires en Python (CSV, Excel, SQL). DataFrame = tableau 2D avec index + colonnes. Maîtriser les filtres booléens et l'indexation (loc/iloc) c'est 80% du job au quotidien.",
        url: "https://pandas.pydata.org/docs/user_guide/10min.html",
        resource: "Pandas - 10 minutes guide",
        resources: [
          { type: "doc", title: "10 Minutes to Pandas", url: "https://pandas.pydata.org/docs/user_guide/10min.html" },
          { type: "doc", title: "Pandas - Indexing & Selection", url: "https://pandas.pydata.org/docs/user_guide/indexing.html" },
          { type: "article", title: "Modern Pandas (Tom Augspurger)", url: "https://tomaugspurger.net/posts/modern-1-intro/" },
          { type: "video", title: "Keith Galli (1h)", url: "https://youtu.be/vmEHCJofslg" },
        ],
        exercise: "# Objectif: filtrer un dataset GPS comme un pro\n\nimport pandas as pd\n\n# 1. Lecture + exploration rapide\ndf = pd.read_csv('gps.csv', parse_dates=['ts'])\ndf.info()        # types + mémoire\ndf.describe()    # stats numériques\ndf.head(20)      # aperçu\n\n# 2. Selection de colonnes\nspeeds = df['speed']           # Series\ndf[['lat','lon','speed']]      # DataFrame (note les []]) \n\n# 3. Filtres booléens (pattern crucial)\nfast = df[df['speed'] > 50]\nin_paris = df[(df.lat.between(48.8,48.9)) & (df.lon.between(2.2,2.4))]\n\n# 4. loc vs iloc (à NE JAMAIS confondre)\ndf.loc[10, 'speed']        # par label\ndf.iloc[10, 3]              # par position\ndf.loc[df.speed>50, ['lat','lon']]  # combo\n\n# 5. Query (lisible pour gros filtres)\ndf.query('speed > 50 and lat > 48.8')\n\n# 6. isin & ~ (NOT)\ncities = ['Paris','Lyon']\ndf[df.city.isin(cities)]\ndf[~df.city.isin(cities)]    # exclusion\n\n# Piège classique: SettingWithCopyWarning\nsubset = df[df.speed>50].copy()  # toujours .copy() !",
      },
      {
        id: "d8",
        label: "GroupBy et Agrégations",
        day: "Mar",
        description: "GroupBy = SQL GROUP BY en Python. Permet d'agréger des données par catégorie (par ville, par jour, par utilisateur). C'est l'opération la plus courante en analyse : comptage, moyenne, somme. Maîtriser .agg() avec multiple fonctions est crucial.",
        url: "https://pandas.pydata.org/docs/user_guide/groupby.html",
        resource: "Pandas - GroupBy User Guide",
        resources: [
          { type: "doc", title: "Pandas GroupBy Guide", url: "https://pandas.pydata.org/docs/user_guide/groupby.html" },
          { type: "article", title: "Real Python - Pandas GroupBy", url: "https://realpython.com/pandas-groupby/" },
          { type: "doc", title: "Pandas - Reshaping & Pivot", url: "https://pandas.pydata.org/docs/user_guide/reshaping.html" },
          { type: "video", title: "Keith Galli GroupBy", url: "https://youtu.be/txMdrV1Ut64" },
        ],
        exercise: "# Objectif: agrégations multi-niveaux comme en SQL\n\n# 1. GroupBy simple\ndf.groupby('vehicle_id')['speed'].mean()\ndf.groupby('city').size()    # count par ville\n\n# 2. Agrégations multiples (.agg)\ndf.groupby('vehicle_id').agg({\n    'speed': ['mean','max','std'],\n    'distance': 'sum',\n    'lat': lambda x: x.iloc[-1]   # dernière position\n})\n\n# 3. Multi-index group\ndaily = df.groupby([df.ts.dt.date, 'city']).agg(\n    n_trips=('trip_id','nunique'),\n    avg_speed=('speed','mean')\n).reset_index()\n\n# 4. Transform (broadcast back to original size)\ndf['speed_pct'] = df.groupby('vehicle_id')['speed'].transform('mean')\ndf['rank'] = df.groupby('vehicle_id')['speed'].rank()\n\n# 5. Pivot table (cross-tab)\npivot = df.pivot_table(\n    values='speed',\n    index='hour',\n    columns='city',\n    aggfunc='mean',\n    fill_value=0\n)\n\n# 6. value_counts (groupby raccourci)\ndf['city'].value_counts(normalize=True)  # pourcentages",
      },
      {
        id: "d9",
        label: "Rolling, shift, diff, merge",
        day: "Mer",
        description: "Pour analyses temporelles : rolling = moyenne mobile (lisser bruit GPS), shift = décaler valeurs (point précédent), diff = variation. Merge = JOIN SQL. Ces 4 opérations couvrent 90% des features engineering en time series.",
        url: "https://pandas.pydata.org/docs/user_guide/window.html",
        resource: "Pandas - Window Functions",
        resources: [
          { type: "doc", title: "Pandas - Windowing Operations", url: "https://pandas.pydata.org/docs/user_guide/window.html" },
          { type: "doc", title: "Pandas - Merging Guide", url: "https://pandas.pydata.org/docs/user_guide/merging.html" },
          { type: "article", title: "Time Series Analysis with Pandas", url: "https://realpython.com/pandas-time-series-analysis/" },
          { type: "doc", title: "Pandas Cheatsheet (PDF)", url: "https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf" },
        ],
        exercise: "# Objectif: features temporelles sur séries GPS\n\n# 1. Rolling - moyenne mobile (lisse le bruit GPS)\ndf['speed_5min'] = df['speed'].rolling(window=5, min_periods=1).mean()\ndf['speed_max_5min'] = df['speed'].rolling(5).max()\n\n# 2. Expanding (cumulative)\ndf['speed_cumavg'] = df['speed'].expanding().mean()\n\n# 3. Shift - point précédent / suivant\ndf['prev_lat'] = df.groupby('trip_id')['lat'].shift(1)\ndf['next_lat'] = df.groupby('trip_id')['lat'].shift(-1)\n\n# 4. Diff - variation (vitesse à partir des positions)\ndf['lat_delta'] = df.groupby('trip_id')['lat'].diff()\ndf['time_delta'] = df.groupby('trip_id')['ts'].diff().dt.total_seconds()\n\n# 5. Merge - JOIN comme SQL\nvehicles = pd.read_csv('vehicles.csv')   # id, type, fleet\ngps_full = df.merge(vehicles, on='vehicle_id', how='left')\n# how: 'inner','left','right','outer','cross'\n\n# 6. Concat (UNION SQL)\nall_data = pd.concat([df_jan, df_feb, df_mar], ignore_index=True)\n\n# Piège: merge avec doublons => explosion lignes\n# Toujours valider:\nassert df.merge(vehicles, on='vehicle_id', validate='many_to_one') is not None",
      },
      {
        id: "d10",
        label: "Dates et Timestamps",
        day: "Jeu",
        description: "Les dates sont partout en data : timestamps GPS, logs, événements. pd.to_datetime() + accesseur .dt sont essentiels. resample() permet de regrouper par fréquence (heure, jour, semaine). Sans ça, impossible de faire de l'analyse temporelle.",
        url: "https://pandas.pydata.org/docs/user_guide/timeseries.html",
        resource: "Pandas - Time Series Guide",
        resources: [
          { type: "doc", title: "Pandas - Time Series", url: "https://pandas.pydata.org/docs/user_guide/timeseries.html" },
          { type: "doc", title: "Python datetime docs", url: "https://docs.python.org/3/library/datetime.html" },
          { type: "article", title: "Effective Datetime in Python", url: "https://realpython.com/python-datetime/" },
          { type: "tool", title: "pendulum (better datetime)", url: "https://github.com/sdispater/pendulum" },
        ],
        exercise: "# Objectif: maîtriser dates pour analyse GPS\n\n# 1. Conversion str -> datetime\ndf['ts'] = pd.to_datetime(df['ts'], format='%Y-%m-%d %H:%M:%S')\n# Auto-detect: pd.to_datetime(df.ts, errors='coerce')\n\n# 2. Accesseur .dt (gold mine)\ndf['hour'] = df['ts'].dt.hour\ndf['weekday'] = df['ts'].dt.dayofweek    # 0=lundi\ndf['weekday_name'] = df['ts'].dt.day_name()\ndf['month'] = df['ts'].dt.month\ndf['is_weekend'] = df['ts'].dt.dayofweek.isin([5,6])\n\n# 3. Timezones (CRUCIAL en prod)\ndf['ts_utc'] = pd.to_datetime(df.ts, utc=True)\ndf['ts_paris'] = df['ts_utc'].dt.tz_convert('Europe/Paris')\n\n# 4. Resample (grouper par fréquence)\ndf = df.set_index('ts')\nhourly = df.resample('1H').agg({'speed':'mean','trip_id':'nunique'})\ndaily = df.resample('1D').sum()\nweekly = df.resample('W-MON').mean()\n\n# 5. Date offsets\nfrom pandas.tseries.offsets import BusinessDay\ndf['next_workday'] = df['ts'] + BusinessDay(1)\n\n# 6. Filtres date (intuitif)\nq1 = df['2026-01':'2026-03']\nthis_year = df[df.ts.dt.year == 2026]",
      },
      {
        id: "d11",
        label: "Performance Pandas",
        day: "Ven",
        description: "Pandas peut être 100x plus rapide ou 100x plus lent selon comment tu l'utilises. apply() est le piège classique = boucle Python lente. Vectorisation, .loc batch, dtypes (category vs object) font la différence entre 10s et 10min.",
        url: "https://pandas.pydata.org/docs/user_guide/enhancingperf.html",
        resource: "Pandas - Enhancing Performance",
        resources: [
          { type: "doc", title: "Pandas - Performance Tips", url: "https://pandas.pydata.org/docs/user_guide/enhancingperf.html" },
          { type: "article", title: "Modern Pandas - Performance", url: "https://tomaugspurger.net/posts/modern-4-performance/" },
          { type: "video", title: "Rob Mulla - 10 tricks", url: "https://youtu.be/SAFmrTnEHLg" },
          { type: "tool", title: "pyarrow backend (Pandas 2.0+)", url: "https://pandas.pydata.org/docs/user_guide/pyarrow.html" },
        ],
        exercise: "# Objectif: optimiser pipeline 10x\n\nimport pandas as pd\nimport numpy as np\n\n# 1. Lecture optimisée\ndf = pd.read_csv('big.csv',\n    dtype={'city':'category', 'speed':'float32'},   # -80% RAM\n    parse_dates=['ts'],\n    engine='pyarrow'    # Pandas 2.0+\n)\n\n# 2. Vectorisation vs apply (100x !)\n# LENT (boucle Python sous le capot):\ndf['fast'] = df['speed'].apply(lambda x: x > 50)\n\n# RAPIDE (vectorisé NumPy):\ndf['fast'] = df['speed'] > 50\n\n# 3. np.where pour conditions\ndf['cat'] = np.where(df.speed>50, 'fast',\n            np.where(df.speed>20, 'medium', 'slow'))\n\n# 4. Categorical pour columns avec peu de valeurs uniques\ndf['city'] = df['city'].astype('category')   # GB de gain\n\n# 5. Eval/query pour filtres complexes (utilise numexpr)\ndf.query('speed > 50 and lat > 48.8')   # plus rapide que df[...]\n\n# 6. Profiler ton code\n%%timeit\ndf['speed'].apply(lambda x: x*2)   # 50ms\ndf['speed'] * 2                      # 0.5ms\n\n# 7. Memory_usage\ndf.memory_usage(deep=True).sum() / 1e9   # GB\ndf.info(memory_usage='deep')\n\n# Règle d'or: SI tu écris .apply(), demande-toi si vectoriser est possible",
      },
      {
        id: "d12",
        label: "Projet: Analyse GPS Kaggle",
        day: "Sam",
        description: "Projet portfolio #2 : EDA complète sur dataset réel + visualisations + insights métier. Démontre que tu sais transformer données brutes en insights actionnables. À mettre sur GitHub avec notebook propre + README.",
        url: "https://www.kaggle.com/datasets/crailtap/taxi-trajectory",
        resource: "Kaggle - Porto Taxi Trajectory",
        resources: [
          { type: "tool", title: "Kaggle Porto Taxi Dataset", url: "https://www.kaggle.com/datasets/crailtap/taxi-trajectory" },
          { type: "article", title: "EDA Methodology", url: "https://towardsdatascience.com/exploratory-data-analysis-eda-a-practical-guide-and-template-for-structured-data-abfbf3ee3bd9" },
          { type: "github", title: "Awesome Jupyter Notebooks", url: "https://github.com/markusschanta/awesome-jupyter" },
          { type: "doc", title: "Pandas Profiling (ydata)", url: "https://github.com/ydataai/ydata-profiling" },
        ],
        exercise: "# Projet portfolio: EDA Taxi GPS\n\n# Notebook structure recommandée:\n# 01_load_explore.ipynb\n# 02_clean_validate.ipynb\n# 03_features.ipynb\n# 04_insights.ipynb\n\n# Tâches:\n# 1. Load + profil rapide (ydata-profiling pour quick wins)\nimport pandas as pd\nfrom ydata_profiling import ProfileReport\ndf = pd.read_csv('train.csv')\nProfileReport(df).to_file('profile.html')\n\n# 2. Nettoyage défensif:\n#    - drop trajets < 30s\n#    - drop coordonnées hors bbox Porto\n#    - validate types/NaN\n\n# 3. Features engineering:\n#    - durée totale (sec)\n#    - vitesse moyenne (km/h)\n#    - distance haversine\n#    - heure / jour semaine / weekend\n\n# 4. Insights MÉTIER (3 minimum):\n#    Q1: Quelles heures de pointe ?\n#    Q2: Trajets weekend vs semaine ?\n#    Q3: Zones les plus actives ? (heatmap)\n\n# 5. Visualisations:\n#    - 1 carte Folium (heatmap)\n#    - 3 graphiques matplotlib propres\n#    - 1 dashboard Plotly interactif\n\n# 6. Export:\n#    - clean_data.parquet\n#    - README avec screenshots + conclusions\n#    - Article LinkedIn court (publication = boost CV)",
      },
    ],
  },
];
