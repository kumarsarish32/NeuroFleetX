public class ConstructorExample {
    String msg;

    ConstructorExample(String m) {
        msg = m;
    }

    public static void main(String[] args) {
        ConstructorExample obj = new ConstructorExample("Hello Constructor");
        System.out.println(obj.msg);
    }
}
