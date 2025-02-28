#!/bin/bash

# Trouver tous les fichiers PNG et les convertir en WebP
find images -name "*.png" -type f | while read -r png_file; do
    # Créer le nom du fichier WebP
    webp_file="${png_file%.png}.webp"
    
    # Convertir le fichier
    cwebp -q 90 "$png_file" -o "$webp_file"
    
    echo "Converti: $png_file -> $webp_file"
done

echo "Conversion terminée !"
