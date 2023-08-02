# Contribuer à Unispace

Avant tout, merci beaucoup de prendre de votre temps pour contribuer à ce projet !

Vous retrouverez ici des recommendations sur comment contribuer au projet. Ce document est amené à évoluer dans le
temps,
ainsi n'hésitez pas à venir le consulter de temps en temps. En tant que contributeurs, vous avez également la
possibilité
de proposer des modifications à ce document, qui pourront par la suite être ajoutées. Ce projet est votre !

## Comment contribuer

Si vous avez remarqué un bug ou que vous souhaitez proposer une nouvelle fonctionnalité, ouvrez un
[nouveau ticket](https://github.com/Schrodin-dev/Unispace/issues/new). Ce ticket permet de confirmer une idée ou la
présence d'un bug avant de mettre les mains dans le code. Il serait dommage de faire des modifications qui seraient par
la suite rejetées..

C'est aussi dans cet espace que vous pourrez trouver des idées de fonctionnalités que vous pourriez implémenter ou aider 
à implémenter !

Si vous avez une question générale sur le projet, vous pouvez utiliser le système de discussions de github, ou le
[discord du projet](https://discord.gg/VyQA6MNp6q).

Afin de mieux se retrouver dans le projet, un bon nom de branche pour une nouvelle fonctionnalité est (pour une modification en
lien avec le ticket 42) :

```shell
git checkout -b 42-ajout-du-droit-enseignant
```

## Implémenter une fonctionnalité ou corriger un bug

À ce point, vous devriez être dans la capacité d'apporter les changements que vous souhaitez au projet ! N'hésitez pas
à poser des questions aux membres dans la communauté, ils auront j'en suis sûr à cœur de vous aider ! 

### Conventions de code à adopter
Afin d'uniformiser le code sur l'ensemble du projet, nous vous demandons d'adopter les conventions de code suivantes
(celles-ci sont susceptibles d'évoluer au gré des propositions) :
- nommer les variables et les fonctions en camelCasing
- nommer les classes en PascalCasing
- utiliser 2 espaces pour l'indentation
- utiliser un point-virgule à la fin d'une instruction
- mettre un espace entre les opérateurs `+ = - / * ` et après les virgules
- pour une fonction, une conditionnelle ou une boucle, adopter le format suivant :
```js
function something(a, b, c) {
	
}
```
```js
if (...) {
	
} else {
	
}
```
```js
for (...) {
	
}
```

### Politique de tests
(Work in progress ! Cette section sera complétée lorsque des tests seront ajoutés au projet.)

## Faire une pull request

Maintenant que vous avez apporté des modifications au projet, il ne vous reste plus qu'à les envoyer !

Pour ce faire, allez dans la branche main du projet, et vérifiez que votre version local est bien à jour :
```shell
git remote add upstream git@github.com:Schrodin-dev/Unispace.git
git checkout master
git pull upstream master
```

Maintenant, mettez à jour votre branche à partir de votre copie de la branche main et envoyez-la !
```shell
git checkout 42-ajout-du-droit-enseignant
git rebase master
git push --set-upstream origin 42-ajout-du-droit-enseignant
```

## Maintenir votre pull request à jour

Si un responsable vous demande de "rebaser" votre pull request, il vous indique que beaucoup de code a changé, et 
que vous devez mettre à jour votre branche pour qu'elle soit plus facile à fusionner.

Voici la procédure conseillée :
```shell
git checkout 42-ajout-du-droit-enseignant
git pull --rebase upstream master
git push --force-with-lease 42-ajout-du-droit-enseignant
```

## Fusionner un pull request (responsable uniquement)
Une pull request ne peut être fusionnée dans main par un responsable que si :

- Elle a été approuvée par au moins deux responsables. Si c'est un responsable qui a ouvert la pull request, une seule approbation supplémentaire est nécessaire.
- Il n'y a pas de changements demandés.
- Elle est à jour avec la branche main actuelle.

N'importe quel responsable est autorisé à fusionner une pull request si toutes ces conditions sont remplies.