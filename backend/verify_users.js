const db = require('./src/config/db');

async function verificarUsuarios() {
    try {
        console.log('Verificando usuarios en la base de datos...\n');
        
        const [usuarios] = await db.query('SELECT id, nombre, username, rol FROM usuarios');
        
        console.log('Usuarios encontrados:');
        console.log('════════════════════════════════════════');
        usuarios.forEach(user => {
            console.log(`ID: ${user.id} | Nombre: ${user.nombre} | Username: ${user.username} | Rol: ${user.rol}`);
        });
        console.log('════════════════════════════════════════\n');
        
        // Verificar que 'maria' tenga rol 'mesero'
        const maria = usuarios.find(u => u.username === 'maria');
        if (maria && maria.rol === 'mesero') {
            console.log('✅ Usuario maria tiene el rol correcto: mesero');
        } else {
            console.log('❌ Usuario maria NO tiene el rol mesero o no existe');
            console.log('   Actualizando rol de maria a mesero...');
            await db.query("UPDATE usuarios SET rol = 'mesero' WHERE username = 'maria'");
            console.log('✅ Rol actualizado');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

verificarUsuarios();
