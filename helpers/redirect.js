module.exports = (req,res) => {
    console.log('---- redirect ----');
    
    let tipo = req.session.user.tipo
    if(tipo == 'cliente'){
        return res.redirect('/clientes/perfil')
    }
    if(tipo == 'admin'){
        return res.redirect('/admin/')
    }
    if(tipo == 'viajante'){
        return res.redirect('/viajantes/perfil')
    }
}