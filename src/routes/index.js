const express = require('express');
const router = express.Router();
const path = require('path');

const loginController = require('../controllers/login_Controller'); // Importa las rutas
const chooseController = require('../controllers/chooseController');
const signUpCController = require('../controllers/signUpC_Controller'); 
const signUpPController = require('../controllers/signUpP_Controller');
const landingController = require('../controllers/landing_Controller');
const adminController = require('../controllers/adminController');
const bagController = require('../controllers/bagController');
const clientProfileController = require('../controllers/clientProfile_Controller');
const confirmationController = require('../controllers/confirmacionController');
const contactUsCController = require('../controllers/contactUsC_Controller');
const contactUsEController = require('../controllers/contactUsE_Controller');
const homeCController = require('../controllers/homeC_Controller');
const homePController = require('../controllers/homeP_Controller');
const menuController = require('../controllers/menuController');
const providerProfileController = require('../controllers/providerProfile_Controller');
const providerProfileHistoryController = require('../controllers/providerProfileHistory_Controller');
const providerProfileMenuController = require('../controllers/providerProfileMenu_Controller');
const providerProfileQAController = require('../controllers/providerProfileQA_Controller');
const providerProfileStatisticsController = require('../controllers/providerProfileStatistics_Controller');
const QAController = require('../controllers/QA_Controller');

router.use('/', landingController);
router.use('/Choose', chooseController);
router.use('/login', loginController); 
router.use('/signUp-C', signUpCController);
router.use('/signUp-P', signUpPController);
router.use('/admin', adminController);
router.use('/bag', bagController);
router.use('/clientProfile', clientProfileController);
router.use('/pedidos', confirmationController);
router.use('/contactUsC', contactUsCController);
router.use('/contactUsE', contactUsEController);
router.use('/homeC', homeCController);
router.use('/homeP', homePController);
router.use('/menu', menuController);
router.use('/providerProfile', providerProfileController);
router.use('/providerProfileHistory', providerProfileHistoryController);
router.use('/providerProfileMenu', providerProfileMenuController);
router.use('/providerQA', providerProfileQAController);
router.use('/providerProfileStatistics', providerProfileStatisticsController);
router.use('/QA', QAController);

module.exports = router;