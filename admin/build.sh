mkdir -p dist
mkdir -p dist/plugins
mkdir -p dist/themes
rm -r -f dist/themes/theme
cp -r theme dist/themes
mkdir -p dist/themes/theme/plugins
cp -r wp-content/plugins/. dist/themes/theme/plugins/
cp -r vendor/advanced-custom-fields/. dist/themes/theme/plugins/
rm -r -f dist/themes/zskostelec
mv dist/themes/theme dist/themes/zskostelec
