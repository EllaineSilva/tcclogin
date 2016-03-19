<?php
require 'vendor/autoload.php';

function getConnection() {
    $dbuser='root';
    $dbpass='090929';
    $dbh = new PDO('mysql:host=localhost;dbname=users', $dbuser, $dbpass);
    $dbh->exec('set names utf8');
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

$app = new Slim\App();

$app->post('/login', function ($request, $response) {
    $data = $request->getParsedBody();
    $sql = "SELECT id FROM clientes WHERE usuario=:usuario AND senha=:password";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam('usuario', $data['un'], PDO::PARAM_STR);
        $stmt->bindParam('password', $data['pw'], PDO::PARAM_STR);
        $stmt->execute();
        $resp = $stmt->fetch(PDO::FETCH_OBJ);
        $db = null;
        $response->getBody()->write(json_encode($resp));
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode($e->getMessage()));
    }
});

$app->post('/cadastro', function ($request, $response) {
    $data = $request->getParsedBody();
    $sql = "INSERT INTO clientes (nome, cpf, rg, telefone, celular, email, tipo) VALUES (:nome, :cpf, :rg, :tel, :cel, :email, :tipoUser)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam('nome', $data['nome'], PDO::PARAM_STR);
        $stmt->bindParam('cpf', $data['cpf'], PDO::PARAM_STR);
        $stmt->bindParam('rg', $data['rg'], PDO::PARAM_STR);
        $stmt->bindParam('tel', $data['tel'], PDO::PARAM_STR);
        $stmt->bindParam('cel', $data['cel'], PDO::PARAM_STR);
        $stmt->bindParam('email', $data['email'], PDO::PARAM_STR);
        $stmt->bindParam('tipoUser', $data['tipoUser'], PDO::PARAM_INT);
        $stmt->execute();
        $db = null;
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode($e->getMessage()));
    }
});

$app->put('/cadastro/{id}', function ($request, $response, $arguments) {
    $data = $request->getParsedBody();
    $sql = "UPDATE clientes SET nome=:nome, cpf=:cpf, rg=:rg, telefone=:telefone, celular=:celular, email=:email, tipo=:tipo WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam('nome', $data['nome'], PDO::PARAM_STR);
        $stmt->bindParam('cpf', $data['cpf'], PDO::PARAM_STR);
        $stmt->bindParam('rg', $data['rg'], PDO::PARAM_STR);
        $stmt->bindParam('telefone', $data['telefone'], PDO::PARAM_STR);
        $stmt->bindParam('celular', $data['celular'], PDO::PARAM_STR);
        $stmt->bindParam('email', $data['email'], PDO::PARAM_STR);
        $stmt->bindParam('tipo', $data['tipo'], PDO::PARAM_INT);
        $stmt->bindParam('id', $arguments['id'], PDO::PARAM_INT);
        $stmt->execute();
        $db = null;
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode($e->getMessage()));
    }
});

$app->get('/cadastro/{id}', function ($request, $response, $arguments) {
    $sql = "SELECT * FROM clientes WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam('id', $arguments['id'], PDO::PARAM_INT);
        $stmt->execute();
        $dado = $stmt->fetch(PDO::FETCH_OBJ);
        $db = null;
        $response->getBody()->write(json_encode($dado));
    } catch (PDOException $e) {
        $response->getBody()->write(json_encode($e->getMessage()));
    }
});

$app->post('/suporte', function ($request, $response) {
    $data = $request->getParsedBody();
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    $headers .= "From: $data[nome] <$data[email]>\r\n";
    mail('hello@easyit.esy.es', 'Suporte SGF', $data[mensagem], $headers);
});

$app->add(new \Slim\Middleware\HttpBasicAuthentication([
    'path' => '/app',
    'authenticator' => function ($arguments) {
    	$sql = "SELECT CASE WHEN usuario = '$arguments[user]' AND password = '$arguments[password]' THEN 1 ELSE 0 END acess FROM users";
    	try {
        	$db = getConnection();
        	$stmt = $db->query($sql);
			$confirm = $stmt->fetch(PDO::FETCH_OBJ);
			if ($confirm->acess) {
				return true;
			} else {
				return false;
			}
    	} catch (PDOException $e) {
        	echo json_encode($e->getMessage());
    	}
    }
]));

$app->run();
?>
