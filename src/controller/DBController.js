// src/controllers/DBController.js
import APIService from '../services/APIService.js';
import logger from '../logger.js';

class DBController {


  async storeDataInDB(data) {
    if (!data || data.length === 0) {
      logger.warn('No data provided to store in the database.');
      return;
    }

    try {
      // Validar y asignar IDs para entidades relacionadas
      let temp = await this.validateAndAssignIDs(data)

      // Registrar usuarios
      temp =await this.registerUsers(temp);
      

      console.log(temp);
      // Registrar publicaciones
      await this.registerPosts(temp);

      logger.info('Data stored in the database successfully.');
    } catch (error) {
      logger.error(`Error storing data in the database:' code: ${error.code} message: ${error.message}`);
      throw error;
    }
  }

  async validateAndAssignIDs(data) {
    // Obtener todos los tipos existentes
    const responseCryptoTypesAll = await APIService.getCryptoTypeAll();
    const responseCurrencyTypesAll = await APIService.getCurrencyTypesAll();
    const responseBankTypesAll = await APIService.getBankTypesAll();

    // Mapear todos los tipos existentes para búsquedas rápidas
    const cryptoTypeMap = new Map(responseCryptoTypesAll.result.map(crypto => [crypto.CryptoName, crypto.Id]));
    const currencyTypeMap = new Map(responseCurrencyTypesAll.result.map(currency => [currency.CurrencyName, currency.Id]));
    const bankTypeMap = new Map(responseBankTypesAll.result.map(bank => [`${bank.BankName}-${bank.CurrencyTypeId}`, bank.Id]));

    // Iterar sobre cada elemento de data
    for (const item of data) {
        // Validar y asignar cryptoTypeId
        if (item.cryptoType) {
            let cryptoTypeId = cryptoTypeMap.get(item.cryptoType);
            if (!cryptoTypeId) {
                try {
                    const responseCreateCryptoType = await APIService.createCryptoType({ cryptoName: item.cryptoType });
                    cryptoTypeId = responseCreateCryptoType.data.result;
                    cryptoTypeMap.set(item.cryptoType, cryptoTypeId); // Agregar nuevo tipo al mapa
                } catch (error) {
                    if (error.response && error.response.status === 409) {
                        logger.warn(`CryptoType ${item.cryptoType} already exists.`);
                    } else {
                        throw error;
                    }
                }
            }
            item.cryptoTypeId = cryptoTypeId;
        }

        // Validar y asignar currencyTypeId
        if (item.currencyType) {
            let currencyTypeId = currencyTypeMap.get(item.currencyType);
            if (!currencyTypeId) {
                try {
                    const responseCreateCurrencyType = await APIService.createCurrencyType({ currencyName: item.currencyType });
                    currencyTypeId = responseCreateCurrencyType.data.result;
                    currencyTypeMap.set(item.currencyType, currencyTypeId); // Agregar nuevo tipo al mapa
                } catch (error) {
                    if (error.response && error.response.status === 409) {
                        logger.warn(`CurrencyType ${item.currencyType} already exists.`);
                    } else {
                        throw error;
                    }
                }
            }
            item.currencyTypeId = currencyTypeId;
        }

        // Validar y asignar bankTypeId
        if (item.bankName && item.currencyTypeId) {
            let bankTypeKey = `${item.bankName}-${item.currencyTypeId}`;
            let bankTypeId = bankTypeMap.get(bankTypeKey);
            if (!bankTypeId) {
                try {
                    const responseCreateBankType = await APIService.createBankType({ bankName: item.bankName, currencyTypeId: item.currencyTypeId });
                    bankTypeId = responseCreateBankType.data.result;
                    bankTypeMap.set(bankTypeKey, bankTypeId); // Agregar nuevo tipo al mapa
                } catch (error) {
                    if (error.response && error.response.status === 409) {
                        logger.warn(`BankType ${item.bankName} with currency ${item.currencyTypeId} already exists.`);
                    } else {
                        throw error;
                    }
                }
            }
            item.bankTypeId = bankTypeId;
        }
    }

    return data; // Devolver los datos modificados con los IDs asignados
}


async registerUsers(data) {
    // Crear un mapa para almacenar los usuarios existentes
    const userMap = new Map();

    for (let item of data) {
        // Comprobar si el usuario ya ha sido verificado en la iteración anterior
        if (userMap.has(item.userCode)) {
            item.userId = userMap.get(item.userCode);
            continue;
        }

        try {
            // Consultar si el usuario ya existe
            const responseUserByCodeName = await APIService.getUserByCodeName({
                params: {
                    codeName: item.userCode
                }
            });

            console.log("1" + item.userCode);
            console.log(responseUserByCodeName);

            if (!responseUserByCodeName.result) {

              if(item.userType&&item.userName&&item.userCode&&item.userCode){
                // Si el usuario no existe, crear uno nuevo
                const userData = {
                    userName: item.userName,
                    merchantType: item.userType,
                    codeName: item.userCode
                };
                console.log("no entro");
                const responseCreateUser = await APIService.createUser(userData);
                const userId = responseCreateUser.data.result.userId; // Asume que el ID está en responseCreateUser.data.result
                console.log("userId");
                console.log(userId);
                item.userId = userId;

                // Almacenar el nuevo usuario en el mapa
                userMap.set(item.userCode, userId);}
              
            } else {
                // Si el usuario ya existe, almacenar el ID en el mapa
                console.log("asdasds")
                console.log(responseUserByCodeName)
                const userId = responseUserByCodeName.result.Id; // Ajusta esto según la estructura de tu respuesta
                item.userId = userId;
                userMap.set(item.userCode, userId);
            }

        } catch (error) {
            if (error.response && error.response.status === 409) {
                logger.warn(`User with codeName ${item.userCode} already exists.`);
            } else {
                logger.warn(`Error with codeName ${item.userCode}.`);
                throw error;
            }
        }
    }

    // Retornar los datos modificados con los userIds asignados
    return data;
}



  async registerPosts(data) {
    for (let item of data) {
      try {
        const postData = {
          userId: item.userId,
          postedPrice: item.postedPrice,
          availableAmount: item.availableAmount,
          minAmount: item.minAmount,
          maxAmount: item.maxAmount,
          bankTypeId: item.bankTypeId,
          cryptoTypeId: item.cryptoTypeId,
          orderTypeId: item.orderType === 'BUY' ? 1 : 0,
          postDate: item.date,
          orderCount: item.orderCount,
          completionRate: item.completionRate,
          likeCount: item.likeCount
        };

        console.log(postData)
        const postId = await APIService.createPost(postData);
        // Puedes almacenar el postId si es necesario
      } catch (error) {
        logger.error('Error creating post:', error.message);
        throw error;
      }
    }
  }


}

export default DBController;
