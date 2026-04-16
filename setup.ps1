Remove-Item package.json -ErrorAction SilentlyContinue
npx -y create-next-app@latest planyatri --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
if (Test-Path planyatri) {
  Move-Item -Path "planyatri\*" -Destination "." -Force
  Move-Item -Path "planyatri\.eslint*" -Destination "." -Force
  Move-Item -Path "planyatri\.gitignore" -Destination "." -Force
  Remove-Item -Path "planyatri" -Recurse -Force
}
