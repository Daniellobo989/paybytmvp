const Product = require('../models/productModel');
const User = require('../models/userModel');

// Criar novo produto
exports.createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      category,
      tags,
      images,
      shipping_options
    } = req.body;
    
    // Validar dados
    if (!title || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, forneça todos os campos obrigatórios'
      });
    }
    
    // Criar produto
    const product = await Product.create({
      seller_id: req.user._id,
      title,
      description,
      price: {
        amount: price.amount,
        currency: price.currency || 'SATS'
      },
      category,
      tags: tags || [],
      images: images || [],
      shipping_options: shipping_options || []
    });
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Obter todos os produtos (com filtros)
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      tags,
      min_price,
      max_price,
      seller_id,
      status,
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;
    
    // Construir filtro
    const filter = { status: status || 'active' };
    
    if (category) filter.category = category;
    if (seller_id) filter.seller_id = seller_id;
    
    if (tags) {
      const tagArray = tags.split(',');
      filter.tags = { $in: tagArray };
    }
    
    if (min_price || max_price) {
      filter['price.amount'] = {};
      if (min_price) filter['price.amount'].$gte = Number(min_price);
      if (max_price) filter['price.amount'].$lte = Number(max_price);
    }
    
    // Configurar paginação
    const skip = (Number(page) - 1) * Number(limit);
    
    // Configurar ordenação
    const sortOptions = {};
    sortOptions[sort_by] = sort_order === 'asc' ? 1 : -1;
    
    // Buscar produtos
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .populate('seller_id', 'email_hash reputation');
    
    // Contar total de produtos
    const total = await Product.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / Number(limit))
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Obter produto por ID
exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id)
      .populate('seller_id', 'email_hash reputation');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar produto
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Buscar produto
    let product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    // Verificar se o usuário é o vendedor
    if (product.seller_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado, apenas o vendedor pode atualizar o produto'
      });
    }
    
    // Verificar se o produto já foi vendido
    if (product.status === 'sold') {
      return res.status(400).json({
        success: false,
        error: 'Não é possível atualizar um produto já vendido'
      });
    }
    
    // Atualizar produto
    product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Excluir produto
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Buscar produto
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    // Verificar se o usuário é o vendedor
    if (product.seller_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado, apenas o vendedor pode excluir o produto'
      });
    }
    
    // Verificar se o produto já foi vendido
    if (product.status === 'sold') {
      return res.status(400).json({
        success: false,
        error: 'Não é possível excluir um produto já vendido'
      });
    }
    
    // Excluir produto
    await product.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Obter categorias
exports.getCategories = async (req, res, next) => {
  try {
    // Buscar categorias únicas
    const categories = await Product.distinct('category');
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Buscar produtos
exports.searchProducts = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Termo de busca não fornecido'
      });
    }
    
    // Configurar paginação
    const skip = (Number(page) - 1) * Number(limit);
    
    // Buscar produtos que correspondem à consulta
    const products = await Product.find({
      $and: [
        { status: 'active' },
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('seller_id', 'email_hash reputation');
    
    // Contar total de produtos
    const total = await Product.countDocuments({
      $and: [
        { status: 'active' },
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / Number(limit))
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};
