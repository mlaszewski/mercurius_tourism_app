import fs from 'fs';

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file = formData.get('file');
    console.log(file);
    if (!file) {
      return Response.json({ message: 'Nie przekazano pliku' }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return Response.json({ message: 'Plik nie może mieć więcej niż 2MB' }, { status: 400 });
    }

    if (!file.type.startsWith('image')) {
      return Response.json({ message: 'Nieprawidłowy format pliku' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const filePath = `/uploads/${Date.now()}_${file.name}`;

    await fs.promises.writeFile(`./public${filePath}`, Buffer.from(fileBuffer));

    return Response.json({ filePath }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return Response.json({ message: 'Błąd wewnętrzny' }, { status: 500 });
  }
}
